import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState} from 'react'
import { RiNotionFill } from "react-icons/ri";



// Chakra Imports
import { Text, Button, useColorMode, IconButton, Center, Input, Link } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'


//Graph Component Imports
import GraphVis from './graphvis'


export default function Home() {

  const {colorMode, toggleColorMode } = useColorMode()
  const [transitionState, setTransitionState] = useState(false)
  const [pageId, setPageId] = useState('')

  const handleTransition = () => {
    setTransitionState(true)
  }

  const handlePageIdChange = (text) => {
    console.log("Original Text: ", text)
    const text_split = text.split('-')
    console.log("Text_Split: ", text_split)
    console.log("Text is updating: ", text_split[text_split.length - 1])
    setPageId(text_split[text_split.length - 1])
  }

  

  return (
    <div>

      {transitionState === true?<GraphVis color_mode={colorMode} page_id={pageId}/>:
        <div>
        <div style={{display: 'flex', position: 'absolute', top:'0', right:'0', margin:'5px'}}>
        <div style={{marginRight: '10px', marginTop:'5px'}}>
          <Link href='https://cooked-comma-304.notion.site/Reference-Doc-d036088c046347c48ccf69b9f3a0053b?pvs=4'><Text as='b'>Reference</Text></Link>
        </div>
        <div className={styles.colorModeButtonIndex}>
        {
        colorMode === 'light'?
          <IconButton onClick={toggleColorMode} aria-label='Search database' icon={<MoonIcon />} >
            Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
          </IconButton>
        :
          <IconButton onClick={toggleColorMode} aria-label='Search database' icon={<SunIcon />} >
            Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
          </IconButton>
          
        
        }
        </div>
        
        
      </div>
      
      <Center>
      <div style={{marginTop:'2%'}}>
          <Center>
          <div style={{fontSize: '200px', textAlign: 'center', marginRight:'5%'}}>
          <RiNotionFill />
          </div>
          </Center>
        <Center>
          <Text as='b' marginTop={'70px'}fontSize={'50px'}>Notion Graph Visualizer</Text>
        </Center>
        <Center>
          <Text as='b' fontSize={'30px'}> 🟣 Obsidian Graph Visualizer For Notion Docs 🟣 </Text>
        </Center>
        <Center>
          <div style={{width: '400px', marginTop:'40px'}}>
            <Input onChange={() => handlePageIdChange(event.target.value)}placeholder='Notion Page Link: '></Input>
          </div>
        </Center>
        {pageId === undefined?<div><Center><Text color='red' marginTop='5px'>Invalid Input</Text></Center></div>:
        
          <div>
            {pageId.length > 1?
            <Center>
              <Button marginTop='10px' onClick={() => handleTransition()}>
                Create Graph 🌎
              </Button>
            </Center>:
            <div></div>
            
            }
          
          </div>
          
          
        }
        
        
      </div>
      </Center>
        </div>
      
      
      }
    <Center> 
    <div className={styles.footerStyle}>
      
        <Text  as='b'>Made by Jaival Patel ❤️</Text>
      
    </div>
    </Center>
    </div>
  )
}

