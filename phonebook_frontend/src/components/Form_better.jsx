function Form_better({ person, onPersonChange, onAdd }) {
    return(
      <div>
        <form onSubmit={onAdd}>
            <div>name: <input name="name" value={person.name} onChange={onPersonChange} /></div>
            <div>number: <input name="number" value={person.number} onChange={onPersonChange}/></div>
            <div><button type="submit">add</button></div>
        </form>
                
      </div>
    )
}

export default Form_better 