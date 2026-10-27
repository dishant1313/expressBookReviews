const axios = require('axios');

async function runTests() {
  const BASE = 'http://localhost:5000';
  let passed = 0;
  let failed = 0;

  function assert(condition, message, detail) {
    if (condition) {
      console.log('PASS: ' + message);
      passed++;
    } else {
      console.error('FAIL: ' + message + (detail ? ' - ' + JSON.stringify(detail) : ''));
      failed++;
    }
  }

  const uniqueSuffix = Date.now();
  const user1 = `user1_${uniqueSuffix}`;
  const user2 = `user2_${uniqueSuffix}`;
  const pass1 = 'pass_secret123';
  const pass2 = 'pass_secret456';

  try {
    // 1. Retrieve all books
    let res = await axios.get(BASE + '/');
    assert(res.status === 200 && Object.keys(res.data).length === 10, 'Retrieve all books', res.data);

    // 2. Retrieve valid ISBN
    res = await axios.get(BASE + '/isbn/1');
    assert(res.status === 200 && res.data.title === 'Things Fall Apart', 'Retrieve valid ISBN 1', res.data);

    // 3. Retrieve invalid ISBN
    try {
      await axios.get(BASE + '/isbn/999');
      assert(false, 'Retrieve invalid ISBN (should 404)');
    } catch (e) {
      assert(e.response && e.response.status === 404, 'Retrieve invalid ISBN 999 returned 404', e.response?.status);
    }

    // 4. Search by known author
    res = await axios.get(BASE + '/author/Jane%20Austen');
    assert(res.status === 200 && res.data.length > 0 && res.data[0].title === 'Pride and Prejudice', 'Search by known author Jane Austen', res.data);

    // 5. Search by unknown author
    try {
      await axios.get(BASE + '/author/UnknownAuthorXYZ');
      assert(false, 'Search by unknown author (should 404)');
    } catch (e) {
      assert(e.response && e.response.status === 404, 'Search by unknown author returned 404', e.response?.status);
    }

    // 6. Search by known title
    res = await axios.get(BASE + '/title/Fairy%20tales');
    assert(res.status === 200 && res.data.length > 0 && res.data[0].author === 'Hans Christian Andersen', 'Search by known title Fairy tales', res.data);

    // 7. Search by unknown title
    try {
      await axios.get(BASE + '/title/UnknownTitleXYZ');
      assert(false, 'Search by unknown title (should 404)');
    } catch (e) {
      assert(e.response && e.response.status === 404, 'Search by unknown title returned 404', e.response?.status);
    }

    // 8. Retrieve existing reviews
    res = await axios.get(BASE + '/review/1');
    assert(res.status === 200 && typeof res.data === 'object', 'Retrieve reviews for ISBN 1', res.data);

    // 9. Retrieve reviews when none exist
    res = await axios.get(BASE + '/review/2');
    assert(res.status === 200 && Object.keys(res.data).length === 0, 'Retrieve empty reviews for ISBN 2', res.data);

    // 10. Register a new user
    res = await axios.post(BASE + '/register', { username: user1, password: pass1 });
    assert(res.status === 200 && res.data.message.includes('successfully registered'), `Register user ${user1}`, res.data);

    // 11. Attempt duplicate registration
    try {
      await axios.post(BASE + '/register', { username: user1, password: pass1 });
      assert(false, 'Duplicate registration (should fail)');
    } catch (e) {
      assert(e.response && (e.response.status === 409 || e.response.status === 400), 'Duplicate registration rejected', e.response?.data);
    }

    // 12. Attempt registration with missing credentials
    try {
      await axios.post(BASE + '/register', { username: 'missing_pass_user' });
      assert(false, 'Missing password (should fail)');
    } catch (e) {
      assert(e.response && e.response.status === 400, 'Registration missing password rejected with 400', e.response?.data);
    }

    // Register user2
    await axios.post(BASE + '/register', { username: user2, password: pass2 });

    // 13. Log in with correct credentials
    const loginRes1 = await axios.post(BASE + '/customer/login', { username: user1, password: pass1 });
    const token1 = loginRes1.data.token;
    assert(loginRes1.status === 200 && !!token1, `Login with correct credentials ${user1}`, loginRes1.data);

    // 14. Log in with incorrect credentials
    try {
      await axios.post(BASE + '/customer/login', { username: user1, password: 'wrongpassword' });
      assert(false, 'Login with wrong password (should fail)');
    } catch (e) {
      assert(e.response && (e.response.status === 401 || e.response.status === 403), 'Login with wrong password rejected', e.response?.status);
    }

    // 15. Access protected endpoint without authentication
    try {
      await axios.put(BASE + '/customer/auth/review/1?review=test');
      assert(false, 'Protected endpoint without auth (should fail)');
    } catch (e) {
      assert(e.response && e.response.status === 403, 'Protected endpoint without auth rejected with 403', e.response?.status);
    }

    // 16. Add a review as user1
    res = await axios.put(BASE + '/customer/auth/review/1?review=Masterpiece%20novel', {}, {
      headers: { Authorization: 'Bearer ' + token1 }
    });
    assert(res.status === 200 && res.data.reviews && res.data.reviews[user1] === 'Masterpiece novel', `${user1} added review`, res.data);

    // 17. Update user1 review
    res = await axios.put(BASE + '/customer/auth/review/1?review=Updated%20review%20by%20user1', {}, {
      headers: { Authorization: 'Bearer ' + token1 }
    });
    assert(res.status === 200 && res.data.reviews[user1] === 'Updated review by user1', `${user1} updated review`, res.data);

    // Login as user2
    const loginRes2 = await axios.post(BASE + '/customer/login', { username: user2, password: pass2 });
    const token2 = loginRes2.data.token;

    // 18. user2 adds review on same ISBN
    res = await axios.put(BASE + '/customer/auth/review/1?review=User2%20review%20is%20fantastic', {}, {
      headers: { Authorization: 'Bearer ' + token2 }
    });
    assert(res.status === 200 && res.data.reviews[user2] === 'User2 review is fantastic', `${user2} added review`, res.data);

    // 19. Verify both reviews exist
    res = await axios.get(BASE + '/review/1');
    assert(res.status === 200 && res.data[user1] === 'Updated review by user1' && res.data[user2] === 'User2 review is fantastic', 'Both reviews present', res.data);

    // 20. Delete user1 review
    res = await axios.delete(BASE + '/customer/auth/review/1', {
      headers: { Authorization: 'Bearer ' + token1 }
    });
    assert(res.status === 200 && res.data.message.includes('deleted'), `${user1} deleted review`, res.data);

    // 21. Verify user2 review remains and user1 review is gone
    res = await axios.get(BASE + '/review/1');
    assert(res.status === 200 && !res.data[user1] && res.data[user2] === 'User2 review is fantastic', `Only ${user2} review remains`, res.data);

    // 22. Attempt to delete user1 review again (now nonexistent)
    try {
      await axios.delete(BASE + '/customer/auth/review/1', {
        headers: { Authorization: 'Bearer ' + token1 }
      });
      assert(false, 'Delete non-existent review (should fail)');
    } catch (e) {
      assert(e.response && e.response.status === 404, 'Delete nonexistent review rejected with 404', e.response?.status);
    }

    console.log('\nTEST SUMMARY:');
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Unexpected test error:', err);
    process.exit(1);
  }
}

runTests();
