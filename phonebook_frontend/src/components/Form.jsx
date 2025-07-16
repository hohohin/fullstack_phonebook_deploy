function Form({nameInput, numberInput, handleName, handleNumber, handleAdd}) {
    return(
      <div>
        <form onSubmit={handleAdd}>
            <div>name: <input value={nameInput} onChange={handleName} /></div>
            <div>number: <input value={numberInput} onChange={handleNumber}/></div>
            <div><button className="addBtn" type="submit">add</button></div>
        </form>
                
      </div>
    )
}

export default Form