import Person from "./Person"

function Display({searching, contacts, handleDelete}) {
    // const namesToShow = names.filter(name => name.includes(searching))
    if(contacts){
        const namesToShow = contacts.filter(contact => 
            contact.name.toLowerCase().includes(searching))
        return(
            <div>
                <h1>Numbers</h1>
                {searching
                    ? <Person contacts={namesToShow} handleDelete={handleDelete} />
                    : <Person contacts={contacts} handleDelete={handleDelete} />
                }
            </div>
        )
    }
    else{
        return null
    }
}

export default Display