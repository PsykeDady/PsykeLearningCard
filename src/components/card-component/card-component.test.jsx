import { describe, expect, it } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import Card from "./card-component"

const domandaMultipla = {
	q: "Indica in quali situazioni è obbligatorio il debriefing",
	a: [
		"SI;primo caso con inganno<br>",
		"NO;secondo caso senza inganno<br>",
		"SI;terzo caso con inganno<br>",
		"NO;quarto caso senza inganno<br>"
	],
	t: "MULTIPLA"
}

const mostra = () => fireEvent.click(screen.getByRole("button"))

describe("Card con domanda MULTIPLA", () => {
	it("sul fronte mostra tutte le opzioni senza rivelare i prefissi SI/NO", () => {
		const {container} = render(<Card question={domandaMultipla}/>)
		const testo = container.textContent

		expect(testo).toContain("primo caso con inganno")
		expect(testo).toContain("secondo caso senza inganno")
		expect(testo).not.toMatch(/SI;|NO;/)
	})

	it("sul retro mostra soltanto le opzioni corrette", () => {
		const {container} = render(<Card question={domandaMultipla}/>)
		mostra()
		const testo = container.textContent

		expect(testo).toContain("primo caso con inganno")
		expect(testo).toContain("terzo caso con inganno")
		expect(testo).not.toContain("secondo caso senza inganno")
		expect(testo).not.toContain("quarto caso senza inganno")
	})

	it("sul retro non lascia visibili i prefissi", () => {
		const {container} = render(<Card question={domandaMultipla}/>)
		mostra()

		expect(container.textContent).not.toMatch(/SI;|NO;/)
	})

	it("riconosce il tipo anche se scritto in minuscolo", () => {
		const {container} = render(<Card question={{...domandaMultipla, t: "multipla"}}/>)

		expect(container.textContent).not.toMatch(/SI;|NO;/)
	})

	it("conserva il testo delle righe che contengono un punto e virgola", () => {
		const conPuntoEVirgola = {
			q: "Domanda",
			a: ["SI;prima parte; seconda parte<br>", "NO;altro caso<br>"],
			t: "MULTIPLA"
		}
		const {container} = render(<Card question={conPuntoEVirgola}/>)
		mostra()

		expect(container.textContent).toContain("prima parte; seconda parte")
	})
})

describe("Card con domanda RIORDINA", () => {
	const domandaRiordina = {
		q: "Riordina le fasi",
		a: ["prima fase", "seconda fase", "terza fase"],
		t: "RIORDINA"
	}

	it("mostra tutte le voci sul fronte e sul retro", () => {
		const {container} = render(<Card question={domandaRiordina}/>)

		expect(container.textContent).toContain("prima fase")

		mostra()

		for (const voce of domandaRiordina.a) {
			expect(container.textContent).toContain(voce)
		}
	})
})

describe("Card con domanda QA", () => {
	it("nasconde la risposta finché non viene mostrata", () => {
		const {container} = render(<Card question={{q: "Domanda", a: "La risposta", t: "QA"}}/>)

		expect(container.textContent).not.toContain("La risposta")

		mostra()

		expect(container.textContent).toContain("La risposta")
	})
})
