<!--
- Name of code artifact: logout.php
- Brief description of what the code does: This php file logs an user out of their session and redirects them to the login page
- Programmer’s name: Zonaid Prithu
- Date the code was created: Nov 23, 2024.
- Preconditions:
• Acceptable Input:
    • Users must access this page using a compatible web browser that supports php
- Unacceptable Input:
- Postconditions:
• Return Values or Types:
    • The functionality logs one out of their current session, no values are returned
-->
<?php
session_start();
session_unset(); // Clear all session variables
session_destroy(); // Destroy the session
header('Location: ../login.html'); // Redirect to login page
exit;
?>
