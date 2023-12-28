
import axios from "axios"

export const GetPageValidStatus = async(pageId) => {
    try {
        const result = await axios.get(`http://localhost:3001/notion/page/${pageId}`, {
            method: "GET"
        })

        const response = await result
        console.log("Data from API: ", result)


    } catch (err) {
        console.log("Error: ", err)

    }
}

export const GetPageInfo = async(pageId) => { //fetching basic notion page information
    try {
        const result = await axios.get(`http://localhost:3001/notion/page/info/${pageId}`, {
            method:"GET"
        })
        
        const response = await result 
        console.log("Data from API about Notion Page:", response['data'])
        return response['data']
    } catch (err) {
        console.log("Error fetching Notion Page Data: ", err)
        return []
    }
}

export const GetBlockInfo = async(blockId) => { //fetch all blocks in page
    try {
        const result = await axios.get(`http://localhost:3001/notion/page/block/info/${blockId}`, {
            method:"GET"
        })
        
        const response = await result['data']
        console.log("Data from API about Notion Page:", response)
        return response
    } catch (err) {
        console.log("Error fetching Notion Page Data: ", err)
    }
}

export const GetPageContent = async(blockId) => { // formulate page content as well as relative links to each word
    try {
        const result = await axios.get(`http://localhost:3001/notion/page/block/content/${blockId}`, {
            method: "GET"
        })

        const response = await result['data']
        console.log("Data from API about Notio Content: ", response)
        return response
    } catch (err) {
        console.log("Error fetching from Notion Page Data: ", err)
    }
}

export const getUsername = async(user_id) => { //getting username from user_id
    try {
        const result = await axios.get(`http://localhost:3001/notion/user/${user_id}`, {
            method: "GET"
        })

        const response = await result['data']
        return response
    } catch (err) {
        return ''
    }
}

export const getTitles = async(pageArray) => {  //getting page titles based on page id
    try {
        const result = await axios.get(`http://localhost:3001/notion/page/title/${pageArray}`, {
            method: "GET"
        })

        const response = await result['data']
        return response
    } catch (err) {
        return ''
    }

}




