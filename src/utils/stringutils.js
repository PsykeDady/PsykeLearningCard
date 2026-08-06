export const formatText = (testo="") => {
	if(!testo || testo==="") return ""; 
	if((typeof testo).toLowerCase() === "string") {
		return testo
			.replaceAll("\r\n", "\n")
			.replaceAll(/\n{2,}/g, "<br/><br/>")
			.replaceAll("\n", "<br/>")
	}
	try {
		return testo.reduce((p,n)=>p+(p===""?"":'<br/>')+formatText(n),"")
	} catch (error) {
		console.error(error)
		return testo
	}
}



