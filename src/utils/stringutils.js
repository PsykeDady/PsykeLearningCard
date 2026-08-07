import katex from "katex"

// $$...$$ formula in blocco, $...$ formula in linea. Il corpus non contiene '$' letterali.
const FORMULA = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g

const formatPlain = (testo="") => testo
	.replaceAll("\r\n", "\n")
	.replaceAll(/\n{2,}/g, "<br/><br/>")
	.replaceAll("\n", "<br/>")

const formatFormula = (tex, displayMode) => {
	try {
		return katex.renderToString(tex, {displayMode, throwOnError: false, strict: false})
	} catch (error) {
		console.error(error)
		return formatPlain(tex)
	}
}

export const formatText = (testo="") => {
	if(!testo || testo==="") return "";
	if((typeof testo).toLowerCase() === "string") {
		let reso = ""
		let letto = 0

		for (const trovata of testo.matchAll(FORMULA)) {
			reso += formatPlain(testo.slice(letto, trovata.index))
			reso += formatFormula(trovata[1] ?? trovata[2], trovata[1] !== undefined)
			letto = trovata.index + trovata[0].length
		}

		return reso + formatPlain(testo.slice(letto))
	}
	try {
		return testo.reduce((p,n)=>p+(p===""?"":'<br/>')+formatText(n),"")
	} catch (error) {
		console.error(error)
		return testo
	}
}
