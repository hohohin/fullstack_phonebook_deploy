function Notification({text, style}){
    if(text === null){
        return null
    }
    return(
        <h3 className="addConfirmNote" style={style}>{text}</h3>
    )
}

export default Notification