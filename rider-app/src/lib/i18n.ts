import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'

const en = {
  common: {
    cancel: 'Cancel', confirm: 'Confirm', back: 'Back', next: 'Next', submit: 'Submit',
  },
  home: {
    where_to: 'Where to?', request_ride: 'Request a ride', schedule_ride: 'Schedule for later',
  },
  ride: {
    finding_driver: 'Finding a driver…', driver_arriving: 'Driver arriving in {{min}} min',
    on_trip: 'On trip', completed: 'Trip complete',
    cancel_ride: 'Cancel ride',
  },
  rate: {
    how_was_ride: 'How was your ride?', add_tip: 'Add a tip?', none: 'None',
  },
  payment: { pay_card: 'Pay with card', pay_paypal: 'Pay with PayPal', pay_cash: 'Pay driver in cash' },
}
const es = {
  common: { cancel: 'Cancelar', confirm: 'Confirmar', back: 'Atrás', next: 'Siguiente', submit: 'Enviar' },
  home: { where_to: '¿A dónde?', request_ride: 'Solicitar viaje', schedule_ride: 'Programar para después' },
  ride: {
    finding_driver: 'Buscando conductor…', driver_arriving: 'Conductor llega en {{min}} min',
    on_trip: 'En viaje', completed: 'Viaje completado', cancel_ride: 'Cancelar viaje',
  },
  rate: { how_was_ride: '¿Cómo estuvo tu viaje?', add_tip: '¿Agregar propina?', none: 'Ninguna' },
  payment: { pay_card: 'Pagar con tarjeta', pay_paypal: 'Pagar con PayPal', pay_cash: 'Pagar al conductor en efectivo' },
}

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: (Localization.getLocales()[0]?.languageCode === 'es') ? 'es' : 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
