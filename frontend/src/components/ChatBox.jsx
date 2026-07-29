import { useState } from "react";
import { askRegulatoryAgent } from "../api/chat";
import "./ChatBox.css";


function ChatBox(){


const [question,setQuestion]=useState("");

const [messages,setMessages]=useState([]);



async function sendMessage(){


if(!question) return;


setMessages([
...messages,
{
role:"user",
text:question
}
]);


const response = await askRegulatoryAgent(question);



setMessages(prev=>[
...prev,
{
role:"ai",
text:response.answer
}
]);



setQuestion("");

}



return (

<div className="chat-box">


<div className="messages">


{
messages.map((msg,index)=>(


<div
key={index}
className={
msg.role==="user"
?
"message user-message"
:
"message ai-message"
}
>

{msg.text}


</div>


))

}


</div>



<div className="input-area">


<input

value={question}

onChange={(e)=>setQuestion(e.target.value)}

placeholder="Ask about GDP / BPD regulations..."

/>


<button

className="send-button"

onClick={sendMessage}

>

Send

</button>


</div>


</div>

);


}


export default ChatBox;