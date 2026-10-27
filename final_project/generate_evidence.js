const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const EVIDENCE_DIR = path.resolve(__dirname, '..', 'submission_evidence');
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

function runCurl(command) {
  try {
    const output = execSync(command, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    return output.trim();
  } catch (err) {
    if (err.stdout) {
      return (err.stdout.toString() + (err.stderr ? '\n' + err.stderr.toString() : '')).trim();
    }
    throw err;
  }
}

console.log('Generating submission evidence files...');

// Deliverable 1: githubrepo
const cmd1 = 'curl.exe -s https://api.github.com/repos/dishant1313/expressBookReviews';
console.log('Running:', cmd1);
const out1 = runCurl(cmd1);
const content1 = `Description: Verification of GitHub fork repository for IBM Skills Network Final Project. Confirms repository parent is ibm-developer-skills-network/expressBookReviews. Note: The official IBM starter repository name is 'expressBookReviews' (with plural 's').
Command:
${cmd1}

Output:
${out1}
`;
fs.writeFileSync(path.join(EVIDENCE_DIR, 'githubrepo'), content1);

// Deliverable 2: getallbooks
const cmd2 = 'curl.exe -i http://localhost:5000/';
console.log('Running:', cmd2);
const out2 = runCurl(cmd2);
const content2 = `Description: Retrieve all books available in the shop from the database using asynchronous handling with Axios.
Command:
${cmd2}

Output:
${out2}
`;
fs.writeFileSync(path.join(EVIDENCE_DIR, 'getallbooks'), content2);

// Deliverable 3: getbooksbyISBN
const cmd3 = 'curl.exe -i http://localhost:5000/isbn/1';
console.log('Running:', cmd3);
const out3 = runCurl(cmd3);
const content3 = `Description: Retrieve book details by ISBN parameter using asynchronous handling with Axios.
Command:
${cmd3}

Output:
${out3}
`;
fs.writeFileSync(path.join(EVIDENCE_DIR, 'getbooksbyISBN'), content3);

// Deliverable 4: getbooksbyauthor
const cmd4 = 'curl.exe -i "http://localhost:5000/author/Jane%20Austen"';
console.log('Running:', cmd4);
const out4 = runCurl(cmd4);
const content4 = `Description: Retrieve all books matching a given author name using asynchronous handling with Axios.
Command:
${cmd4}

Output:
${out4}
`;
fs.writeFileSync(path.join(EVIDENCE_DIR, 'getbooksbyauthor'), content4);

// Deliverable 5: getbooksbytitle
const cmd5 = 'curl.exe -i "http://localhost:5000/title/Pride%20and%20Prejudice"';
console.log('Running:', cmd5);
const out5 = runCurl(cmd5);
const content5 = `Description: Retrieve book details matching a given title using asynchronous handling with Axios.
Command:
${cmd5}

Output:
${out5}
`;
fs.writeFileSync(path.join(EVIDENCE_DIR, 'getbooksbytitle'), content5);

// Deliverable 6: getbookreview
const cmd6 = 'curl.exe -i http://localhost:5000/review/1';
console.log('Running:', cmd6);
const out6 = runCurl(cmd6);
const content6 = `Description: Retrieve initial reviews associated with a specified book ISBN.
Command:
${cmd6}

Output:
${out6}
`;
fs.writeFileSync(path.join(EVIDENCE_DIR, 'getbookreview'), content6);

// Deliverable 7: register
const testUser = `student_${Date.now().toString().slice(-6)}`;
const testPass = 'securePassword123!';
const cmd7 = `curl.exe -i -X POST http://localhost:5000/register -H "Content-Type: application/json" -d "{\\"username\\":\\"${testUser}\\",\\"password\\":\\"${testPass}\\"}"`;
console.log('Running:', cmd7);
const out7 = runCurl(cmd7);
const content7 = `Description: Register a new user with valid username and password credentials.
Command:
${cmd7}

Output:
${out7}
`;
fs.writeFileSync(path.join(EVIDENCE_DIR, 'register'), content7);

// Deliverable 8: login
const cookiePath = path.resolve(__dirname, 'cookie.txt');
const cmd8 = `curl.exe -i -c "${cookiePath}" -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d "{\\"username\\":\\"${testUser}\\",\\"password\\":\\"${testPass}\\"}"`;
console.log('Running:', cmd8);
const out8 = runCurl(cmd8);
const content8 = `Description: Authenticate user using registered credentials and obtain JWT access token and session cookie.
Command:
${cmd8}

Output:
${out8}
`;
fs.writeFileSync(path.join(EVIDENCE_DIR, 'login'), content8);

// Deliverable 9: reviewadded
const reviewText = 'A timeless masterpiece of literature with profound cultural significance.';
const cmd9 = `curl.exe -i -b "${cookiePath}" -X PUT "http://localhost:5000/customer/auth/review/1?review=${encodeURIComponent(reviewText)}"`;
console.log('Running:', cmd9);
const out9 = runCurl(cmd9);
const verifyReviewCmd = 'curl.exe -i http://localhost:5000/review/1';
const verifyReviewOut = runCurl(verifyReviewCmd);
const content9 = `Description: Add a new book review for ISBN 1 under the authenticated session. Includes verification of stored review data.
Command:
${cmd9}

Output:
${out9}

Verification Query:
${verifyReviewCmd}

Verification Output:
${verifyReviewOut}
`;
fs.writeFileSync(path.join(EVIDENCE_DIR, 'reviewadded'), content9);

// Deliverable 10: deletereview
const cmd10 = `curl.exe -i -b "${cookiePath}" -X DELETE http://localhost:5000/customer/auth/review/1`;
console.log('Running:', cmd10);
const out10 = runCurl(cmd10);
const verifyDeleteCmd = 'curl.exe -i http://localhost:5000/review/1';
const verifyDeleteOut = runCurl(verifyDeleteCmd);
const content10 = `Description: Delete the authenticated user's review for ISBN 1. Includes verification that the review has been removed.
Command:
${cmd10}

Output:
${out10}

Verification Query:
${verifyDeleteCmd}

Verification Output:
${verifyDeleteOut}
`;
fs.writeFileSync(path.join(EVIDENCE_DIR, 'deletereview'), content10);

// Cleanup cookie.txt so no session secrets remain
if (fs.existsSync(cookiePath)) {
  fs.unlinkSync(cookiePath);
}

console.log('All 10 evidence files generated successfully in:', EVIDENCE_DIR);
