function Filter({searching, handleSearch}){
    return(
        <>
          🔎 <input value={searching} onChange={handleSearch}/>
        </>
    )
}

export default Filter