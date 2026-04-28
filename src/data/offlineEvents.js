import { products } from './products'

/**
 * Helper: returns a Unix timestamp N hours ago from now.
 */
const hoursAgo = (h) => Math.floor(Date.now() / 1000) - h * 3600

/**
 * Sample offline conversion events for Conversions API (CAPI).
 *
 * These simulate physical-store purchases, phone orders, etc.
 * `event_time` must be within the last 7 days for CAPI to accept it.
 *
 * User data fields are sent UN-hashed here — the server endpoint
 * hashes them (where required) before forwarding to Meta.
 */
export const offlineEvents = [
  {
    event_name: 'Purchase',
    event_time: hoursAgo(2),
    action_source: 'physical_store',
    order_id: 'OFF-10001',
    user_data: {
      email: ['jane.doe@example.com'],
      phone: ['+6591234567'],
      first_name: 'Jane',
      last_name: 'Doe',
      gender: 'f',
      date_of_birth: '19900315',
      city: 'Singapore',
      state: 'SG',
      zip: '018956',
      country: 'sg',
      external_id: 'cust-001',
    },
    custom_data: {
      currency: 'USD',
      value: products[0].price,
      content_type: 'product',
      contents: [
        {
          id: products[0].id,
          quantity: 1,
          price: products[0].price,
          brand: 'AudioTech',
          category: products[0].category,
        },
      ],
    },
  },
  {
    event_name: 'Purchase',
    event_time: hoursAgo(6),
    action_source: 'physical_store',
    order_id: 'OFF-10002',
    user_data: {
      email: ['john.smith@example.com'],
      phone: ['+6598765432', '+6561234567'],
      first_name: 'John',
      last_name: 'Smith',
      gender: 'm',
      date_of_birth: '19851220',
      city: 'Singapore',
      state: 'SG',
      zip: '049315',
      country: 'sg',
      external_id: 'cust-002',
    },
    custom_data: {
      currency: 'USD',
      value: products[1].price + products[5].price,
      content_type: 'product',
      contents: [
        {
          id: products[1].id,
          quantity: 1,
          price: products[1].price,
          brand: 'TimeCraft',
          category: products[1].category,
        },
        {
          id: products[5].id,
          quantity: 2,
          price: products[5].price,
          brand: 'HydroFlask',
          category: products[5].category,
        },
      ],
    },
  },
  {
    event_name: 'Purchase',
    event_time: hoursAgo(18),
    action_source: 'phone_call',
    order_id: 'OFF-10003',
    user_data: {
      email: ['alice.tan@example.com'],
      phone: ['+6581112222'],
      first_name: 'Alice',
      last_name: 'Tan',
      gender: 'f',
      date_of_birth: '19921108',
      city: 'Singapore',
      state: 'SG',
      zip: '238801',
      country: 'sg',
      external_id: 'cust-003',
    },
    custom_data: {
      currency: 'USD',
      value: products[3].price,
      content_type: 'product',
      contents: [
        {
          id: products[3].id,
          quantity: 1,
          price: products[3].price,
          brand: 'KeyMaster',
          category: products[3].category,
        },
      ],
    },
  },
  {
    event_name: 'Purchase',
    event_time: hoursAgo(30),
    action_source: 'physical_store',
    order_id: 'OFF-10004',
    user_data: {
      email: ['bob.lee@example.com'],
      phone: ['+6599887766'],
      first_name: 'Bob',
      last_name: 'Lee',
      gender: 'm',
      date_of_birth: '19880704',
      city: 'Singapore',
      state: 'SG',
      zip: '179101',
      country: 'sg',
      external_id: 'cust-004',
    },
    custom_data: {
      currency: 'USD',
      value: products[2].price + products[4].price,
      content_type: 'product',
      contents: [
        {
          id: products[2].id,
          quantity: 1,
          price: products[2].price,
          brand: 'BrewCo',
          category: products[2].category,
        },
        {
          id: products[4].id,
          quantity: 1,
          price: products[4].price,
          brand: 'CanvasCo',
          category: products[4].category,
        },
      ],
    },
  },
  {
    event_name: 'Purchase',
    event_time: hoursAgo(48),
    action_source: 'physical_store',
    order_id: 'OFF-10005',
    user_data: {
      email: ['carol.wong@example.com'],
      phone: ['+6587654321', '+6590001111'],
      first_name: 'Carol',
      last_name: 'Wong',
      gender: 'f',
      date_of_birth: '19950501',
      city: 'Singapore',
      state: 'SG',
      zip: '048580',
      country: 'sg',
      external_id: 'cust-005',
    },
    custom_data: {
      currency: 'USD',
      value: products[0].price + products[3].price + products[5].price,
      content_type: 'product',
      contents: [
        {
          id: products[0].id,
          quantity: 1,
          price: products[0].price,
          brand: 'AudioTech',
          category: products[0].category,
        },
        {
          id: products[3].id,
          quantity: 1,
          price: products[3].price,
          brand: 'KeyMaster',
          category: products[3].category,
        },
        {
          id: products[5].id,
          quantity: 3,
          price: products[5].price,
          brand: 'HydroFlask',
          category: products[5].category,
        },
      ],
    },
  },
  {
    event_name: 'Lead',
    event_time: hoursAgo(12),
    action_source: 'phone_call',
    user_data: {
      email: ['dave.lim@example.com'],
      phone: ['+6512345678'],
      first_name: 'Dave',
      last_name: 'Lim',
      gender: 'm',
      date_of_birth: '19970823',
      city: 'Singapore',
      state: 'SG',
      zip: '188065',
      country: 'sg',
      external_id: 'cust-006',
    },
    custom_data: {
      currency: 'USD',
      value: products[0].price,
      content_type: 'product',
      contents: [
        {
          id: products[0].id,
          quantity: 1,
          price: products[0].price,
          brand: 'AudioTech',
          category: products[0].category,
        },
      ],
    },
  },
]
