import { describe, expect, it } from "vitest"
import { formatText } from "./stringutils"

describe("formatText", () => {
	it("restituisce stringa vuota per input vuoto o assente", () => {
		expect(formatText()).toBe("")
		expect(formatText("")).toBe("")
	})

	it("converte i ritorni a capo in <br/>", () => {
		expect(formatText("uno\ndue")).toBe("uno<br/>due")
		expect(formatText("uno\n\ndue")).toBe("uno<br/><br/>due")
		expect(formatText("uno\r\ndue")).toBe("uno<br/>due")
	})

	it("unisce gli array con <br/>", () => {
		expect(formatText(["uno", "due"])).toBe("uno<br/>due")
	})

	it("lascia intatto l'HTML già presente nei contenuti", () => {
		expect(formatText("prima<br>dopo")).toBe("prima<br>dopo")
	})

	it("renderizza una formula in linea con KaTeX", () => {
		const reso = formatText("La stima è $e^{At}$ nel tempo")

		expect(reso).toContain("katex")
		expect(reso).toMatch(/^La stima è /)
		expect(reso).toMatch(/ nel tempo$/)
		expect(reso).not.toContain("$")
	})

	it("distingue formula in blocco e in linea", () => {
		expect(formatText("$$x^2$$")).toContain("katex-display")
		expect(formatText("$x^2$")).not.toContain("katex-display")
	})

	it("applica i ritorni a capo anche al testo attorno alle formule", () => {
		const reso = formatText("prima\n\n$x^2$\n\ndopo")

		expect(reso).toContain("<br/><br/>")
		expect(reso).toContain("katex")
	})

	it("non interrompe il rendering su LaTeX non valido", () => {
		expect(() => formatText("$\\frac{1}$")).not.toThrow()
	})
})
