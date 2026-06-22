import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CatalogueMobile from "../../components/M04-Mobile/CatalogueMobile";
import * as bookingService from "../../services/bookingService";

// Mock del servicio de reservas
jest.mock("../../services/bookingService", () => ({
  validateSlotAvailability: jest.fn(),
}));

describe("Catálogo y Selección de Horarios Mobile (Autor: Enzo)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Ley de Fitts (M04-RF01)
  test("ESCENARIO 1: Los botones de selección de eventos en el catálogo cumplen con la Ley de Fitts (>= 44x44px)", () => {
    render(
      <CatalogueMobile events={[{ id: 1, name: "Consulta", duration: 30 }]} />,
    );

    const eventButton = screen.getByRole("button", { name: /Consulta/i });
    expect(eventButton).toBeInTheDocument();

    // Verificando que el botón tenga clases CSS que mapean a dimensiones mínimas de accesibilidad (>= 44px)
    expect(eventButton).toHaveClass("min-h-[44px]");
    expect(eventButton).toHaveClass("min-w-[44px]");
  });

  // Test 2: Bloqueo temporal 10 min (M04-RF02)
  test("ESCENARIO 2: Al seleccionar un horario disponible, se bloquea temporalmente por 10 minutos", () => {
    // Retornamos que el horario está disponible usando tipado explícito
    (bookingService.validateSlotAvailability as jest.Mock).mockReturnValue(
      true,
    );

    render(
      <CatalogueMobile events={[{ id: 1, name: "Consulta", duration: 30 }]} />,
    );

    // Seleccionamos el evento y luego el slot de las 10:00
    fireEvent.click(screen.getByRole("button", { name: /Consulta/i }));

    const slotButton = screen.getByRole("button", { name: /10:00/i });
    fireEvent.click(slotButton);

    // Verificamos que la interfaz muestre el bloqueo y el tiempo de 10 min (600 segundos)
    expect(screen.getByText(/Bloqueado por 10:00/i)).toBeInTheDocument();
    expect(screen.getByText(/Tiempo restante: 10:00/i)).toBeInTheDocument();
  });

  // Test 3: Conflicto simultáneo (M04-RF02)
  test("ESCENARIO 3: Se muestra un mensaje de error si se intenta seleccionar un slot bloqueado (conflicto simultáneo)", () => {
    // Simulamos un conflicto de superposición usando tipado explícito
    (bookingService.validateSlotAvailability as jest.Mock).mockImplementation(
      () => {
        throw new Error(
          "Este horario acaba de ser seleccionado por otro usuario. Por favor, elige uno nuevo",
        );
      },
    );

    render(
      <CatalogueMobile events={[{ id: 1, name: "Consulta", duration: 30 }]} />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Consulta/i }));

    const slotButton = screen.getByRole("button", { name: /10:00/i });
    fireEvent.click(slotButton);

    // Verificamos que el error en pantalla sea el correcto
    expect(
      screen.getByText(
        /Este horario acaba de ser seleccionado por otro usuario/i,
      ),
    ).toBeInTheDocument();
  });
});
