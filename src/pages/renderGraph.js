// src/components/ForceNetworkGraph.js

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text
} from '@chakra-ui/react'

import theme from './api/theme';




export function ForceNetworkGraph(props) {
  const svgRef = useRef();
  const frameSize = { width: 1700, height: 850 };
  const [nodeArray, setNodeArray] = useState([])
  const [linkArray, setLinkArray] = useState([])
  const [viewPageStatus, setViewPageStatus] = useState(false)
  const [clickedTitle, setClickedTitle] = useState('')
  const [clickedContents, setclickedContents] = useState([])
  const [clickedString, setClickedString] = useState('')
  const [colorMode, setColorMode] = useState('')

  const [graphColor, setGraphColor] = useState('')

  const createNodeStructure = (unique_pages, page_titles, graph_color) => {
    console.log("Graph Colour: ", graph_color)
    var node_array = []
    for (let i =0; i <= unique_pages.length; i++) {
      const cur_page_id = unique_pages[i]
      if (cur_page_id === undefined) {
        continue 
      } else {
        const cur_title = page_titles[cur_page_id][0]
        node_array.push({id:cur_page_id, title:cur_title, color:graph_color})
      }
    }

    return node_array
    
  }

  const createLinkStructure = (block_strcture) => {
    var link_array = []
    for (let i =0; i<= Object.keys(block_strcture).length; i++) {
      const cur_page_key = Object.keys(block_strcture)[i]
      if (cur_page_key === undefined) {
        continue
      } else {
        const relations = block_strcture[cur_page_key]
        for (let j = 0; j <= relations.length; j++) {
          const child_page = relations[j]
          if (child_page === undefined) {
            continue
          } else {
            link_array.push({source: cur_page_key, target:child_page})
          }
        }
      }
    }

    return link_array
  }



  useEffect(() => {

    const color_mode = props.color_mode
    console.log("props color_mode: ", color_mode)
    setColorMode(color_mode)

    const graph_color = props.graph_color 
    console.log("Graph Color: ", graph_color)
    setGraphColor(graph_color)



    var drag = simulation => {
  
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }
      
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }
      
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
      
      return d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
    }

    //fetching props
    const pageTitles = props.pageTitles // to create node array and page display
    const pagesContent = props.pagesContent // for page expansion 
    const blockStructure = props.blockStructure // to create link dictionary
    const uniquepages = props.uniqueNodes
    console.log("pageTitles from Props: ", pageTitles)
    console.log("pagesContent from Props: ", pagesContent)
    console.log("Block Structure: ", blockStructure)
    console.log("Unique Nodes: ", uniquepages)
    const node_array = createNodeStructure(uniquepages, pageTitles, graph_color)
    setNodeArray(node_array)
    console.log("Node Array: ", node_array)
    const link_array = createLinkStructure(blockStructure)
    setLinkArray(link_array)
    const data = {
      nodes: node_array,
      links: link_array
    }

    



    //fetching relevant page content





    // Define your graph data
    
  
      // Set up the force simulation
      const simulation = d3
        .forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id((d) => d.id))
        .force('charge', d3.forceManyBody().strength(-10))
        .force('center', d3.forceCenter(frameSize.width / 2, frameSize.height / 2));
        
  
      // Create SVG container
      const svg = d3.select(svgRef.current);

      
  
      // Draw links
      const link = svg
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', 2);
  
      // Draw nodes
      const node = svg
        .selectAll('circle')
        .data(data.nodes)
        .enter()
        .append('circle')
        .attr('r', 8)
        .attr('fill', (d) => d.color)
        
        .call(drag(simulation))
        .on("mouseenter", (evt, d) => {
          link
            .attr("display", "none")
            .filter(l => l.source.id === d.id || l.target.id === d.id)
            .attr("display", "block");
          node.append("title")
            .text(d => d.title)
          
            
        })
        .on("mouseleave", evt => {
          link.attr("display", "block");
        })
        .on('click', handleClick)
    
      

        
    
      // Set up tick function for simulation
      simulation.on("tick", () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
    
        node.attr("cx", d => d.x).attr("cy", d => d.y);
      });
      
  
    function handleClick(_, d) {
      console.log("Node has been clicked: ", d.id)
      setViewPageStatus(true)
      setClickedTitle(pageTitles[d.id][0])
      setclickedContents(pageTitles[d.id])
      
      setClickedString(pagesContent[d.id][0])
    }


    const intervalId = setInterval(() => {
        simulation.alpha(0.3).restart();
      }, 600); // Adjust the interval time as needed
  
      // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {colorMode === 'dark'?
        <div>
          <svg ref={svgRef} width="1700" height="850"></svg>
          <div  style={{backgroundColor:'black'}}>
          <Drawer  onClose={() => setViewPageStatus(false)} isOpen={viewPageStatus} size={'md'}>
          <DrawerOverlay />
          <div style={{backgroundColor: 'red'}}>
          <DrawerContent>
            <DrawerCloseButton />
            
            <DrawerHeader>
  
              <Text as='b' fontSize='40px'>{clickedTitle}</Text>
  
            </DrawerHeader>
            
            <DrawerBody>
              <div style={{display: 'flex'}}>
                <Text as='b' fontSize='14px' color='gray'>Time Created: </Text>
                <Text marginTop='4px' marginLeft='2px' fontSize='11px'>{clickedContents[1]}</Text>
              </div>
              <></>
              <div style={{display: 'flex', marginBottom:'20px'}}>
                <Text as='b' fontSize='14px' color='gray'>Last Time Edited: </Text>
                <Text marginTop='4px' marginLeft='2px' fontSize='11px'>{clickedContents[2]}</Text>
              </div>
              
              {clickedString === ''?<p>This Notion Page is Empty :(</p>:
                <p>
                  {clickedString}
                </p>
              }
              
            </DrawerBody>
          </DrawerContent>
          </div>
        </Drawer>
        </div>
      </div>
      
      
      
      
      
      :
            <div>
            <svg ref={svgRef} width="1700" height="850"></svg>
            <Drawer  onClose={() => setViewPageStatus(false)} isOpen={viewPageStatus} size={'md'}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>
    
                <Text as='b' fontSize='40px'>{clickedTitle}</Text>
    
              </DrawerHeader>
              
              <DrawerBody>
                <div style={{display: 'flex'}}>
                  <Text as='b' fontSize='14px' color='gray'>Time Created: </Text>
                  <Text marginTop='4px' marginLeft='2px' fontSize='11px'>{clickedContents[1]}</Text>
                </div>
                <></>
                <div style={{display: 'flex', marginBottom:'20px'}}>
                  <Text as='b' fontSize='14px' color='gray'>Last Time Edited: </Text>
                  <Text marginTop='4px' marginLeft='2px' fontSize='11px'>{clickedContents[2]}</Text>
                </div>
                
                {clickedString === ''?<p>This Notion Page is Empty :(</p>:
                  <p>
                    {clickedString}
                  </p>
                }
                
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </div>
      
      
      }
    </div>

  
  )
};


