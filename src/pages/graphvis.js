// Chakra Imports
import { Text, Button, useColorMode, IconButton, Center, Image,   Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    Fade, ScaleFade, Slide, SlideFade, Collapse, useDisclosure, Box, Lorem, PinInputDescendantsProvider, position, Divider, Stack, Link, Select } from '@chakra-ui/react'
import { MoonIcon, SunIcon, ChevronRightIcon, CloseIcon } from '@chakra-ui/icons'

//API Imports
import { GetBlockInfo, GetPageContent, GetPageInfo, getUsername, getTitles } from './api/notion'

//Component Import 
import ForceNetworkGraph from '../pages/renderGraph'



import styles from '@/styles/Home.module.css'
import { useState, useEffect} from 'react'



export default function GraphVis(props) {

    const {colorMode, toggleColorMode } = useColorMode()
    const [user_details, setUserDetails] = useState({})
    const {isOpen, onToggle} = useDisclosure()
    const [pagesContent, setPagesContent] = useState([])
    const [pageTitles, setPageTitles] = useState({})
    const [blockStructure, setBlockStructure] = useState({})
    const [uniqueNodes, setUniqueNodes] = useState([])
    const [color_mode, setColorMode] = useState('')
    const [graphColor, setGraphColor] = useState('#C6F6D5')
    const [undefinedResultStatus, setUndefinedStatus] = useState(false)

    const handleGraphColor = (graph_color) => {
        if (graph_color === 'Graph Color') {

        } else {
            setGraphColor(graph_color)
            console.log(graph_color)
            
        }
    }


    useEffect(() => {

        const color_mode_prop = props.color_mode

        setColorMode(color_mode_prop)

        const pageId = props.page_id
        console.log("PageId: ", pageId)
        
        async function fetchAPIData() {
            //console.log("In function")
            var result = await GetPageInfo(pageId)
            var user_information = result['created_by']['id']
            //console.log("user information: ", user_information)
            var username_data = await getUsername(user_information)
            //console.log("username: ", username_data)
            setUserDetails(username_data)
            
            
        }

         fetchAPIData()


         function fetchUniquePages(dict) { 
            var lst = []
            for (let i =0; i <= Object.keys(dict).length; i++) {
                const cur_key = Object.keys(dict)[i]
                if (cur_key === undefined) {
                    continue
                } else {
                    if (lst.includes(cur_key)) {
                        //pass
                    } else {
                        lst.push(cur_key)
                    }
                }
            }

            for (let i =0; i <= Object.values(dict).length; i++) {
                const cur_value_array = Object.values(dict)[i]
                if (cur_value_array === undefined) {
                    continue
                }
                for (let j =0; j <= cur_value_array.length; j++) {
                    const cur_page = cur_value_array[j]
                    if (cur_page === undefined) {
                        continue
                    }
                    if (lst.includes(cur_page) === false) {
                        lst.push(cur_page)
                    }
                }
            }
            setUniqueNodes(lst)
            return lst
         }

         async function fetchChildBlocks() {
            console.log("in function")
            var page_content_dict = {}
            var result = await GetBlockInfo(pageId)
            console.log("Block Result: ", result)
            if (result === undefined) {
                //setUndefinedStatus(true)
            }
            setBlockStructure(result)
            // testing
            var pages = fetchUniquePages(result) // only considers keys, need to consider all pages 

            for (let element_idx = 0; element_idx <= pages.length; element_idx++) {
                const pageId = pages[element_idx]
                if (pageId === undefined) {
                    continue
                } else {
                    var page_content = await GetPageContent(pageId)
                    page_content_dict[pageId] = page_content
                }
            }
            
            console.log("Page Content: ", page_content_dict)
            setPagesContent(page_content_dict)

            const unique_keys = Object.keys(page_content_dict)
            console.log(JSON.stringify(unique_keys))
            const page_titles_dict = await getTitles(JSON.stringify(unique_keys))
            //console.log("page titles dict: ", page_titles_dict)
            setPageTitles(page_titles_dict)
         }

         fetchChildBlocks()

    }, [graphColor])

    return (
        <div>
            {undefinedResultStatus === true?
            
            
            <div>
                <Center>
                <Text marginTop='150px' as='b'>No Notion Page Found :(</Text>
                </Center>
                <Center>
                    <Link href='/'><Text marginTop='20px'>Return to Home</Text></Link>
                </Center>
            </div>
            
            
            :
            <div>
                <div style={{display:'flex', position: 'absolute', top:'0', right:'0', margin:'10px', marginTop:'15px'}}>
                
                <Popover>
                    <PopoverTrigger>
                        <div style={{marginRight:'10px'}}>
                            <Image borderRadius='full' boxSize='40px' src={user_details['avatar_url']} alt='notion pic'/>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        
                        <PopoverBody>
                        <div style={{marginTop:'10px', border:'none'}}>
    
                            <Select onChange={() => handleGraphColor(event.target.value)}border='none' placeholder='Graph Colour'>
                                <option  value='#C6F6D5'>Green.100 </option>
                                <option value='#FEFCBF'>Yellow.100</option>
                                <option value='#F56565'>Red.400</option>
                                <option value='#0BC5EA'>Cyan.400</option>
                                <option value='#E9D8FD'>Purple.100</option>
                                <option value='#FBB6CE'>Pink.200</option>
                            </Select>
                        </div>
                            <div style={{marginTop:'5px'}}>
                                <Link href='https://cooked-comma-304.notion.site/Reference-Doc-d036088c046347c48ccf69b9f3a0053b?pvs=4'>
                                    <Text>Reference</Text>
                                </Link>
                            </div>
                            <div style={{marginTop:'5px'}}>
                                <Link href='/'>
                                    <Text>Sign Out</Text>
                                </Link>
                            </div>
                            
                            
    
    
    
                        </PopoverBody>
                    </PopoverContent>
                    </Popover>
                
                <div>
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
                
                {user_details === {}?
                
                <div>
                    <Text>Loading</Text>
                </div>:
                    <div>
                    
                    
                    <div>
                        <Text marginLeft='10px' fontSize='5xl' as='b'>{user_details['name']}&apos; s Notion</Text>
                    </div>
                    </div>
                
                
                }
                
                <div style={{position: 'absolute', marginTop:'10%'}}>
                <IconButton height='400px' aria-label='launch dashboard' onClick={onToggle} icon={<ChevronRightIcon />}> </IconButton>
                
                <Slide direction='left' in={isOpen} style={{ zIndex: 10, marginTop:'13%' }}>
                {colorMode === 'dark'?
                            <div className={styles.parentTreeStructureDark}>
                                <div style={{margin: '10px', marginLeft:'20px', fontSize:'30px'}}>
                                    <Text as='b'>Directory View</Text>
                                </div>
                                <Box
                                p='40px'
                                color='black'
                                mt='4'
                                
                                
                                
                                onClick={onToggle}
                                >
                                
                                {Object.keys(pageTitles).length === 0 ?<div><Text color='red'>Loading...</Text></div>:
                                                            <div style={{marginTop:'-30px'}}>
                                                            {Object.keys(blockStructure).length === 0?<div><Text>Loading...</Text></div>:
                                                                <div>
                                                                    {Object.keys(blockStructure).map((parent_page, index) => {
                                                                        return (
                                                                        <div key={index}>
                                                                        <Stack direction='column'>
                                                                            
                                                                            <Text color='white'>{pageTitles[parent_page][0]}</Text>
                                                                            {blockStructure[parent_page].map((child_page, index) => {
                                                                                return (
                                                                                <div key={index}>
                                                                                <Stack direction='row' h='80px' p={4}>
                                                                                
                                                                                    <Divider orientation='vertical' />
                                                                                    
                                                                                        <Text color='white'>{pageTitles[child_page][0]}</Text>
                                                                                        
                                                                                    
                                                                                </Stack>
                                                                                </div>
                                                                                )
                                                                            })}
                                                                                
                                                                                        
                                                                        </Stack>
                                                                        </div>
                                                                        
                                                                        )
                                                                    })}
                                                                </div>}
                                                            
                                                        </div>
                                
                                }
            
                                </Box>
                            </div>
                
                
                
                
                :
                            <div className={styles.parentTreeStructure}>
                                <div style={{margin: '10px', marginLeft:'20px', fontSize:'30px'}}>
                                    <Text as='b'>Tree Directory View</Text>
                                </div>
                                <Box
                                p='40px'
                                color='black'
                                mt='4'
                                
                                
                                
                                onClick={onToggle}
                                >
                                
                                {Object.keys(pageTitles).length === 0 ?<div><Text>Loading...</Text></div>:
                                                            <div style={{marginTop:'-30px'}}>
                                                            {Object.keys(blockStructure).length === 0?<div><Text>Loading...</Text></div>:
                                                                <div>
                                                                    {Object.keys(blockStructure).map((parent_page, index) => {
                                                                        return (
                                                                        <div key={index}>
                                                                        <Stack direction='column'>
                                                                            
                                                                            <Text color='black'>{pageTitles[parent_page][0]}</Text>
                                                                            {blockStructure[parent_page].map((child_page, index) => {
                                                                                return (
                                                                                <div key={index}>
                                                                                    <Stack direction='row' h='80px' p={4}>
                                                                                    
                                                                                        <Divider orientation='vertical' />
                                                                                        
                                                                                            <Text color='black'>{pageTitles[child_page][0]}</Text>
                                                                                            
                                                                                        
                                                                                    </Stack>
                                                                                </div>
                                                                                )
                                                                            })}
                                                                                
                                                                                        
                                                                        </Stack>
                                                                        </div>
                                                                        
                                                                        )
                                                                    })}
                                                                </div>}
                                                            
                                                        </div>
                                
                                }
            
                                </Box>
                            </div>
                
                
                }
    
                </Slide> 
                </div>
                <Center>
                    {pagesContent.length === 0 || Object.keys(pageTitles).length === 0?
                    <div>
                        <Text>Loading...</Text>
                    </div>:
                    <div className={styles.graphBox}>
                        {console.log("graph Color changed for graph: ", graphColor)}
                        <ForceNetworkGraph graph_color={graphColor} color_mode={colorMode} uniqueNodes={uniqueNodes} blockStructure={blockStructure} pageTitles={pageTitles} pagesContent={pagesContent}/>
                    </div>
    
                
                }
                    
                </Center>

            </div>
            
            
            
            
            
            
            }
            
        </div>
        
    )
}