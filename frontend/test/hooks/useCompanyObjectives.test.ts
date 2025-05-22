import { renderHook, act } from "@testing-library/react";
import { useCompanyObjectives } from "../../src/hooks/useCompanyObjectives";
import fetchMock from "jest-fetch-mock";

describe("useCompanyObjectives", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("hakee ja asettaa companyObjectives-tiedot", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([
        {
          perustehtava: ["Testi perustehtävä"],
          paamaara: ["Testi päämäärä"],
          avainstrategiat: [
            {
              tavoite: "Tavoite 1",
              omistaja: "NN",
              toimenpide: "Toimenpide 1",
              seuranta: "yellow",
            },
          ],
          nykytila: {
            pros: ["Hyvä asia"],
            cons: ["Huono asia"],
          },
        },
      ])
    );

    const { result } = renderHook(() => useCompanyObjectives());

    // odota useEffectin async-haun valmistumista
    await act(async () => {});

    expect(result.current.perustehtava).toEqual(["Testi perustehtävä"]);
    expect(result.current.paamaara).toEqual(["Testi päämäärä"]);
    expect(result.current.avainstrategiat).toEqual([
      {
        tavoite: "Tavoite 1",
        omistaja: "NN",
        toimenpide: "Toimenpide 1",
        seuranta: "yellow",
      },
    ]);
    expect(result.current.pros).toEqual(["Hyvä asia"]);
    expect(result.current.cons).toEqual(["Huono asia"]);
    expect(result.current.viesti).toBeNull();
  });

  it("asettaa virheviestin, jos fetch epäonnistuu", async () => {
    fetchMock.mockRejectOnce(new Error("Fetch error"));

    const { result } = renderHook(() => useCompanyObjectives());

    await act(async () => {});

    expect(result.current.viesti).toEqual("Virhe tietojen haussa");
  });

  it("tallentaa tiedot onnistuneesti", async () => {
    fetchMock.mockResponses(
      // first for initial GET
      [JSON.stringify([]), { status: 200 }],
      // second for POST
      ["", { status: 200 }]
    );

    const { result } = renderHook(() => useCompanyObjectives());

    await act(async () => {});

    await act(async () => {
      await result.current.tallennaTiedot();
    });

    expect(result.current.viesti).toBe("Tiedot tallennettu onnistuneesti.");
  });

  it("asettaa virheen, jos tallennus epäonnistuu", async () => {
    fetchMock.mockResponses(
      // initial GET
      [JSON.stringify([]), { status: 200 }],
      // POST fail
      [JSON.stringify({ message: "Tallennusvirhe" }), { status: 400 }]
    );

    const { result } = renderHook(() => useCompanyObjectives());

    await act(async () => {});

    await act(async () => {
      await result.current.tallennaTiedot();
    });

    expect(result.current.viesti).toMatch(/Virhe tallennuksessa/);
  });
});
