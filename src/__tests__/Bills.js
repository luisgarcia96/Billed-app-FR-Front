/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect';
import {screen, waitFor, fireEvent} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { handleClickIconEye } from '../containers/Bills.js';
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon).toHaveClass("active-icon")

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("should navigate to the NewBill route when the new bill button is clicked", async ()=> {
      //We simulate the login of an employee
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      Object.defineProperty(window, 'fetch', ()=>{})
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))

      //We create the root element that will contain all the UI of our application
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)

      //We activate the router function
      router()

      //We navigate to the bills dashboard
      window.onNavigate(ROUTES_PATH.Bills)

      //We wait for out button to appear
      await waitFor(() => screen.getByTestId('btn-new-bill'))
      const newBillButton = screen.getByTestId('btn-new-bill')

      //Check the rout after clicking
      fireEvent.click(newBillButton);
      expect(window.location.href).toContain(ROUTES_PATH.NewBill);
    })
    test("Then clicking the eye icon should display the modal with the bill image", async () => {
        //We simulate the login of an employee
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        Object.defineProperty(window, 'fetch', ()=>{})
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
  
        //We create the root element that will contain all the UI of our application
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
  
        //We activate the router function
        router()
  
        //We navigate to the bills dashboard
        window.onNavigate(ROUTES_PATH.Bills)

      // Mock the necessary elements and data
      document.body.innerHTML = BillsUI({ data: bills });

      //Get the eye icon 
      await waitFor(() => {screen.getAllByTestId('icon-eye')[0]});
      const eyeIcon = screen.getAllByTestId('icon-eye')[0];

      //@Guillaume help please
    
      // Trigger the click event on the icon
      // fireEvent.click(eyeIcon);
    
      // Wait for the modal to be displayed
      // await waitFor(() => screen.getByTestId("modaleFile"));
      // const modal = screen.getByTestId("modaleFile")

    });
    
  })
})
