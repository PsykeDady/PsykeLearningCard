#!/usr/bin/env node
// Verifica che ogni formula $...$ / $$...$$ dei subject JSON sia LaTeX valido per KaTeX.
// Uso: node scripts/check-formulas.mjs
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import katex from "katex"

const RADICE = "public/assets/subjects"
const FORMULA = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g

const elencaJson = (cartella) => readdirSync(cartella).flatMap((voce) => {
	const percorso = join(cartella, voce)
	if (statSync(percorso).isDirectory()) return elencaJson(percorso)
	return percorso.endsWith(".json") ? [percorso] : []
})

let formule = 0
const errori = []

for (const percorso of elencaJson(RADICE).sort()) {
	const domande = JSON.parse(readFileSync(percorso, "utf8"))

	domande.forEach((domanda, indice) => {
		const testi = [domanda.q, ...(Array.isArray(domanda.a) ? domanda.a : [domanda.a])]

		for (const testo of testi) {
			if (typeof testo !== "string") continue

			// un numero dispari di '$' indica un delimitatore non chiuso
			if ((testo.match(/\$/g) || []).length % 2 !== 0) {
				errori.push({percorso, indice, tex: testo.slice(0, 70), motivo: "delimitatore $ non chiuso"})
			}

			for (const trovata of testo.matchAll(FORMULA)) {
				const tex = trovata[1] ?? trovata[2]
				formule += 1
				try {
					katex.renderToString(tex, {displayMode: trovata[1] !== undefined, throwOnError: true, strict: false})
				} catch (errore) {
					errori.push({percorso, indice, tex, motivo: errore.message})
				}
			}
		}
	})
}

for (const {percorso, indice, tex, motivo} of errori) {
	console.error(`✗ ${percorso} [${indice}]\n  ${tex}\n  → ${motivo}\n`)
}

console.log(`${formule} formule verificate, ${errori.length} errori`)
process.exit(errori.length === 0 ? 0 : 1)
