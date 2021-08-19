import dynamic from "next/dynamic" /*to allow the server access to the window object in the client side*/
import { useEffect, useState } from "react"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import { EditorState } from "draft-js"
import { db } from "../firebase"
import { session, useSession } from "next-auth/client"
import { convertToRaw, convertFromRaw } from "draft-js"
import { useRouter } from "next/dist/client/router"
import { useDocumentOnce } from "react-firebase-hooks/firestore"

const Editor = dynamic(
   () => import("react-draft-wysiwyg").then((module) => module.Editor),/*The wysiwyg has a lot of modules and we only need the editor module */
   {
       ssr:false,/*ony get teh editor for the client side and not for the server side rendering*/
   }

)

function TextEditor() {
    const router =useRouter();
    const { id } = router.query;
    const [session] =useSession();
    const [snapshot] =useDocumentOnce(db.collection("userDocs").doc(session.user.email).collection("docs").doc(id))
    useEffect(() => {
        if(snapshot?.data()?.editorState){
            seteditorState(editorState.createWithContent(
              convertFromRaw(snapshot?.data()?.editorState)

            ))
        }
        
    }, [])
    const [editorState, seteditorState] = useState(EditorState.createEmpty());
   
    const onEditorStateChange =()=>{
         seteditorState(editorState);
         db.collection("userDocs").doc(session.user.email).collection("docs").doc(id).set({
             editorState:convertToRaw(editorState.getCurrentContent())
         },{
             merge:true
         })

    };
    console.log(editorState)
    return (
        <div className="bg-[#F8F9FA] min-h-screen pb-16"> 
            
            <Editor
            toolbarClassName="flex sticky top-0 z-50 !justify-center mx-auto"
            onEditorStateChange ={onEditorStateChange}
            editorClassName="mt-6 bg-white shadow-lg max-w-6xl mx-auto mb-12 border"
            />
        </div>
    )
}

export default TextEditor
