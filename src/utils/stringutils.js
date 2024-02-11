export const formatText = (testo="") => {
	if(!testo || testo==="") return ""; 
	if((typeof testo).toLowerCase() === "string")
		return testo.replace("\n","<br/>")
	try {
		return testo.reduce((p,n)=>p+(p===""?"":'<br/>')+formatText(n),"")
	} catch (error) {
		console.error(error)
		return testo
	}
}



