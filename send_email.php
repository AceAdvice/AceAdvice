<?php
// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    
    // Set email recipient
    $to = "chaitali.b@aceadvicellc.com";
    
    // Set email subject
    $subject = "New Contact Form Submission from $name";
    
    // Set email message
    $message = "Name: $name\n";
    $message .= "Email: $email\n\n";
    
    // Handle file uploads
    $attachments = array();
    
    // Process resume
    if (isset($_FILES['resume']) && $_FILES['resume']['error'] == 0) {
        $resume = $_FILES['resume'];
        $attachments[] = $resume;
        $message .= "Resume: " . $resume['name'] . "\n";
    }
    
    // Process cover letter
    if (isset($_FILES['cover-letter']) && $_FILES['cover-letter']['error'] == 0) {
        $coverLetter = $_FILES['cover-letter'];
        $attachments[] = $coverLetter;
        $message .= "Cover Letter: " . $coverLetter['name'] . "\n";
    }
    
    // Set email headers
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    // If there are attachments, use multipart/mixed
    if (!empty($attachments)) {
        $boundary = md5(time());
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "From: $email\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
        
        $body = "--$boundary\r\n";
        $body .= "Content-Type: text/plain; charset=ISO-8859-1\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($message)) . "\r\n";
        
        // Add attachments
        foreach ($attachments as $file) {
            $body .= "--$boundary\r\n";
            $body .= "Content-Type: application/octet-stream; name=\"" . $file['name'] . "\"\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n";
            $body .= "Content-Disposition: attachment; filename=\"" . $file['name'] . "\"\r\n\r\n";
            $body .= chunk_split(base64_encode(file_get_contents($file['tmp_name']))) . "\r\n";
        }
        
        $body .= "--$boundary--";
    } else {
        $body = $message;
    }
    
    // Send email
    $mailSent = mail($to, $subject, $body, $headers);
    
    // Return response
    if ($mailSent) {
        echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send email']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?> 