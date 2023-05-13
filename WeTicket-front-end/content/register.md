---
title: "Register Pages for My Tickets System"
draft: false
---
<div style={{ display: 'grid', placeItems: 'center' }}>
  <div style={{ display: 'grid', gap: '1rem' }}>
    <label htmlFor="username" className="font-semibold text-black dark:text-white">Username:</label>
    <input type="text" id="username" name="username" style={{ width: '400px' }} />

    <label htmlFor="email" className="font-semibold text-black dark:text-white">Email:</label>
    <input type="email" id="email" name="email" style={{ width: '400px' }} />

    <label htmlFor="password" className="font-semibold text-black dark:text-white">Password:</label>
    <input type="password" id="password" name="password" style={{ width: '400px' }} />

    <label htmlFor="phone" className="font-semibold text-black dark:text-white">Phone:</label>
    <input type="text" id="phone" name="phone" style={{ width: '400px' }} />
  </div>
  <button type="submit" style={{ height: '30px', width: '100px', backgroundColor: 'green', color: 'white', border: '1px solid black', borderRadius: '15px', marginTop: '20px' }}>Register</button>
  <div style={{ paddingLeft: '350px' }}>
    <span style={{ marginTop: '10px' }}>[Already have an account?](./tickets)</span>
  </div>
</div>
---
