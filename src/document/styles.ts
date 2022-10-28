import styled from "styled-components"


export const ScrollbarWrapper:any = styled.div(():any => ({
    width: "383px",
    height: "75vh",
    maxHeight: "900px",
    overflowY: "scroll",
    scrollbarColor: "white blue",
    padding: 20,
    direction: "ltr",  // if you want to show the scroll bar on the left 
    margin: 0 ,
    "::-webkit-scrollbar": {
        width: "12px",
    },
    "::-webkit-scrollbar-track": {
        boxShadow: "nset 0 0 6px grey",
        borderRadius: "5px"
    },
    "::-webkit-scrollbar-thumb": {
        background: 'darkBlue',
        borderRadius: "15px",
        height: "2px"
    },
    "::-webkit-scrollbar-thumb:hover": {
        background: 'lightBlue',
        maxHeight: "10px"
    },
    "::-webkit-scrollbar-button:vertical:start:decrement": {
        background: `url(${process.env.PUBLIC_URL}/static/icons/arrow-example.png) no-repeat center center`,
        display: "block",
        backgroundSize: "10px"
    },
    "::-webkit-scrollbar-button:vertical:end:increment": {
        display: "block",
        background: `url(${process.env.PUBLIC_URL}/static/icons/arrow-example.png) no-repeat center center`,
        backgroundSize: "10px"
    },
}))



export default ScrollbarWrapper