import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TekstikenttaOsio from "../../../src/components/tavoitteet/TekstikenttaOsio";

describe("TekstikenttaOsio", () => {
  const mockPaivita = jest.fn();

  const setup = (propsOverride = {}) => {
    // Tyypillinen lähtödata
    const props = {
      otsikko: "Testiosio",
      rivit: ["Rivi 1", "Rivi 2"],
      paivita: mockPaivita,
      isAuthorized: true,
      ...propsOverride,
    };

    // Simuloi käyttäjärooli
    localStorage.setItem("role", props.isAuthorized ? "admin" : "guest");

    return render(<TekstikenttaOsio {...props} />);
  };

  beforeEach(() => {
    mockPaivita.mockClear();
  });

  it("näyttää otsikon", () => {
    setup();
    expect(screen.getByText("Testiosio")).toBeInTheDocument();
  });

  it("näyttää rivit", () => {
    setup();
    expect(screen.getByDisplayValue("Rivi 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Rivi 2")).toBeInTheDocument();
  });

  it("päivittää riviä kun syöte muuttuu", () => {
    setup();
    const input = screen.getByDisplayValue("Rivi 1");
    fireEvent.change(input, { target: { value: "Muokattu rivi" } });
    expect(mockPaivita).toHaveBeenCalledWith(["Muokattu rivi", "Rivi 2"]);
  });

  it("poistaa rivin kun roskakori-ikonia klikataan", () => {
    setup();
    const poistaNapit = screen.getAllByTitle("Poista rivi");
    fireEvent.click(poistaNapit[0]);
    expect(mockPaivita).toHaveBeenCalledWith(["Rivi 2"]);
  });

  it("lisää uuden rivin", () => {
    setup();
    const lisaaNappi = screen.getByTitle("Lisää rivi");
    fireEvent.click(lisaaNappi);
    expect(mockPaivita).toHaveBeenCalledWith(["Rivi 1", "Rivi 2", ""]);
  });

  it("ei salli muokkausta, kun käyttäjä ei ole valtuutettu", () => {
    setup({ isAuthorized: false });
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach((input) => {
      expect(input).toHaveAttribute("readonly");
    });
    expect(screen.queryByTitle("Poista rivi")).toBeNull();
    expect(screen.queryByTitle("Lisää rivi")).toBeNull();
  });
});
