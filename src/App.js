import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';

const App = () => {
  const wordCloudRef = useRef();
  const [selectedWordText, setSelectedWordText] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);
  const [isFusioned, setIsFusioned] = useState(false);
  const colors = [
    '#ff7f50', // Coral
    '#ffd700', // Gold
    '#6a5acd', // Slate Blue
    '#ff69b4', // Hot Pink
    '#8a2be2', // Blue Violet
    '#20b2aa', // Light Sea Green
    '#deb887', // Burlywood
    '#6495ed', // Cornflower Blue
    '#dc143c', // Crimson
    '#7fff00', // Chartreuse
    // ... add more if needed
];

  const wordsData = [
    { text: '人', value: 10, images: [{ src: 'ren1.png', title: '唐' }, { src: 'ren2.png', title: '宋' }, { src: 'fusion1.png', title: '' }] },
    { text: '文', value: 9, images: [{ src: 'wen1.png', title: '唐' }, { src: 'wen2.png', title: '宋' }, { src: 'fusion2.png', title: '' }] },
    { text: '之', value: 8, images: [{ src: 'zhi1.png', title: '唐' }, { src: 'zhi2.png', title: '宋' }, { src: 'fusion3.png', title: '' }] },
    { text: '而', value: 7, images: [{ src: 'er1.png', title: '唐' }, { src: 'er2.png', title: '宋' }, { src: 'fusion4.png', title: '' }] },
    { text: '山', value: 6, images: [{ src: 'shan1.png', title: '唐' }, { src: 'shan2.png', title: '宋' }, { src: 'fusion5.png', title: '' }] },
    { text: '入', value: 5, images: [{ src: 'ru1.png', title: '唐' }, { src: 'ru2.png', title: '宋' }, { src: 'fusion6.png', title: '' }] },
    { text: '以', value: 4, images: [{ src: 'yi1.png', title: '唐' }, { src: 'yi2.png', title: '宋' }, { src: 'fusion7.png', title: '' }] },
    { text: '子', value: 3, images: [{ src: 'zi1.png', title: '唐' }, { src: 'zi2.png', title: '宋' }, { src: 'fusion8.png', title: '' }] },
    { text: '生', value: 2, images: [{ src: 'sheng1.png', title: '唐' }, { src: 'sheng2.png', title: '宋' }, { src: 'fusion9.png', title: '' }] },
    { text: '日', value: 1, images: [{ src: 'ri1.png', title: '唐' }, { src: 'ri2.png', title: '宋'}, { src: 'fusion10.png', title: '' }] },
  ];

  useEffect(() => {
    const sizeScale = d3.scaleLinear()
      .domain([1, 10])
      .range([20, 80]); // Adjust font sizes

    // Prepare the words for the cloud
    const getRandomRotation = () => Math.random() * 30 - 15; // Random rotation between -15 and 15
    const mappedWords = wordsData.map(word => ({ ...word, size: sizeScale(word.value) }));

    // Create the cloud layout
    const layout = cloud()
      .size([800, 600]) // Word cloud size
      .words(mappedWords)
      .padding(9)
      .rotate(() => 10)
      .fontSize(d => d.size)
      .on('end', drawWordCloud);

    layout.start();

    function drawWordCloud(words) {

      words.forEach(word => {
        word.rotate = getRandomRotation(); // Assign random rotation
      });

      d3.select(wordCloudRef.current).selectAll('*').remove();

      const svg = d3.select(wordCloudRef.current)
        .attr('width', layout.size()[0])
        .attr('height', layout.size()[1])
        .append('g')
        .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`);

        svg.selectAll('text')
        .style('cursor', 'pointer')
        .data(words)
        .enter().append('text')
        .style('font-size', d => `${d.size}px`)
        .style('font-family', 'sans-serif')
        .style('fill', (d, i) => colors[i % colors.length]) // Use the color array
        .attr('text-anchor', 'middle')
        .attr('transform', d => {
          // Assign a random rotation when the words are first created
          d.rotate = Math.random() * 30 - 15; // Random rotation between -15 and 15
          return `translate(${d.x}, ${d.y}) rotate(${d.rotate})`;
        })
        .text(d => d.text)
        .on('click', (event, d) => {

          if (d && d.text) {
            setSelectedWordText(d.text);
           } // Update the selected word text state

          // Get the bounding box of the word cloud group element
          const bbox = d3.select(wordCloudRef.current).node().getBBox();
          const topRightX = layout.size()[0] / 2 - d.size; // You may need to adjust this value
          const topRightY = -layout.size()[1] / 2 + d.size; // You may need to adjust this value
          // Calculate the translation needed to move the word to the top right
          const translationX = topRightX - d.x - d.size; // Subtract d.size to account for word width
          const translationY = topRightY - d.y;
          d3.select(event.currentTarget)
          .transition()
          .duration(750) // Adjust duration as needed
          .style('font-weight', 'bold')
          .attr('transform', `translate(${topRightX}, ${topRightY}) rotate(0)`);


          // Move the clicked word to the middle
          setSelectedWord(d);
          setIsFusioned(false);
          svg.selectAll('text')
            .filter(word => word !== d)
            .transition()
            .duration(750) // Adjust duration as needed
            .style('font-weight', word => (word.text === d.text ? 'bold' : 'normal'))
            .attr('transform', word => `translate(${word.x}, ${word.y}) rotate(${word.rotate})`);
        });
    }
  }, []);

  const handleFusion = () => {
    setIsFusioned(!isFusioned); // Toggle fusion state
  };

  const mainContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // You can remove or keep this as a fallback
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    width: '100%',
    minHeight: '100vh', // Make sure it covers at least the whole viewport height
    backgroundSize: 'cover', // Cover the entire area of the div
    backgroundPosition: 'center center', // Center the image in the div
    backgroundRepeat: 'no-repeat', // Do not repeat the background image
    backgroundImage: 'url("path_to_your_image.jpg")', // Add your image URL here
  };
  

  const imageContainerStyle = (index) => ({
    display: 'inline-block',
    width: '33.33%',
    height: '200px',
    margin: '0 10px',
    position: 'relative',
    overflow: 'hidden',
    opacity: isFusioned && index < 2 ? 0.5 : 1,
    transform: isFusioned && index < 2 ? `translateX(${index === 0 ? 50 : -50}%)` : 'none',
    transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
    zIndex: index === 1 && isFusioned ? 1 : 'auto', // Bring the second image to the front when overlapped
  });

  // Style for the image itself
  const imgStyle = (index) => ({
    height: '180px', // Fixed height for all images
    width: 'auto',  // Let the width be automatically adjusted
    objectFit: 'cover', // This will cover the area of the container with the image
    position: 'absolute', // Absolute position to allow for manual positioning
    left: '50%', // Center horizontally
    top: '50%', // Center vertically
    transform: isFusioned && index < 2 
      ? `translate(-50%, -50%) ${index === 0 ? '' : 'translateX(-13%)'}` 
      : 'translate(-50%, -50%)',
    opacity: isFusioned && index < 2 ? 0.75 : 1,
    transition: 'transform 0.5s ease-out, opacity 0.5s ease-out',
  });

  
  

  return (
    <div style={{ 
      textAlign: 'center',
      backgroundImage: 'url("/bg1.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    
    
    
    }}>
      <h1>Welcome to the Bibliography Visualization</h1>
      <p>This is a tool to help you differentiate confusing words.</p>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <h2>Word Cloud</h2>
          <svg ref={wordCloudRef} style={{ width: '100%', height: '600px' }}></svg>
          <div key={selectedWordText} style={{ 
          position: 'absolute', // Position absolutely
          top: '100px', // Distance from top of the parent
          //bottom: '20px', // Distance from bottom of the parent
          left: '50%', // Center horizontally
          transform: 'translateX(-50%)', // Ensure it's centered
          width: '100%' // Take full width
        }}>
          <p style={{ fontSize: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
          <span style={{ color: 'black' }}>Selected Word:</span> 
            <span style={{ color: 'purple' }}>{selectedWordText || 'None'}</span>
          </p>
        </div>

        </div>
        <div style={{ width: '50%' }}>
          <h2>Images</h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
          {selectedWord && selectedWord.images.map((image, index) => (
            <div key={index} style={imageContainerStyle(index)}>
              <img 
                src={process.env.PUBLIC_URL + '/' + image.src} 
                alt={`Image ${index}`} 
                style={imgStyle(index)}
              />
              <p style={{ position: 'absolute', bottom: '0', width: '100%', textAlign: 'center' }}>
                {isFusioned && index < 2 ? (index === 1 ? 'Fusioned' : '') : image.title}
              </p>
            </div>
            ))}
          </div>
          {/* Button to trigger image overlap */}
          {selectedWord && (
            <button onClick={handleFusion} style={{ marginTop: '10px' }}>
              {isFusioned ? 'Separate Images' : 'Overlap Images'}
            </button>
          )}
        </div>
      </div>
      <audio autoPlay loop>
        <source src="audio.mp3" />
      </audio>
    </div>
  );
};
export default App;
