import React from 'react';
import Logo from "../../component/logo";

export default function TermsOfUse() {
    return (
        <div>
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,  // Ensure it stays on top of other elements
                backgroundColor: '#1c1c1c',  // Dark background for the logo section
                padding: '10px',
                textAlign: 'left',
                width: '100%',
            }}>
                <Logo />
            </div>
            
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#1c1c1c',  // Dark background
                padding: '20px',
                color: '#fff',  // Light text color
                paddingTop: '60px',  // Ensure there is enough space for the sticky logo
            }}>
                <div style={{
                    maxWidth: '800px',
                    width: '100%',
                    backgroundColor: '#333',  // Slightly lighter dark background for content area
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                    lineHeight: '1.6',
                }}>
                    <h1 style={{
                        textAlign: 'center',
                        marginBottom: '20px',
                        color: '#fff',  // Light text for heading
                    }}>Terms of Use</h1>
                    <p style={{ fontSize: '16px', marginBottom: '20px' }}><strong>Effective Date:</strong> January 1st 2025</p>

                    <p style={{ marginBottom: '20px' }}>Welcome to mangopuff (the "Platform for sharing embracing thoughts."). By accessing or using the Platform, you agree to comply with and be bound by these Terms of Use (the "Terms"). If you do not agree to these Terms, you may not use the Platform.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff',  // Light text for sub-headings
                    }}>1. Acceptance of Terms</h2>
                    <p style={{ marginBottom: '20px' }}>By accessing or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms, including any additional terms and policies referenced herein or available by hyperlink. If you are using the Platform on behalf of an organization, you represent and warrant that you are authorized to bind that organization to these Terms.</p>
                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff'
                    }}>2. Eligibility</h2>
                    <p style={{ marginBottom: '20px' }}>You must be at least 18 years old to use the Platform. By using the Platform, you represent and warrant that you are eligible to use the service and have the legal capacity to agree to these Terms.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff'
                    }}>3. User Responsibilities</h2>
                    <p style={{ marginBottom: '10px' }}>You agree to use the Platform responsibly and in accordance with these Terms. You are solely responsible for any content that you upload, post, or share on the Platform. You agree not to:</p>
                    <ul style={{
                        marginBottom: '20px',
                        paddingLeft: '20px',
                        lineHeight: '1.6'
                    }}>
                        <li>Post or share any content that is unlawful, defamatory, harassing, abusive, or discriminatory.</li>
                        <li>Use the Platform for any fraudulent, malicious, or harmful activities.</li>
                        <li>Post personal or sensitive information of others without their consent.</li>
                        <li>Impersonate any person or entity or falsely represent your affiliation with any person or entity.</li>
                        <li>Violate any applicable laws, rules, or regulations.</li>
                    </ul>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff'
                    }}>4. Content Ownership and License</h2>
                    <p style={{ marginBottom: '20px' }}>You retain ownership of the content you post on the Platform, including text, images, videos, and other materials (the "User Content"). However, by posting User Content, you grant mangopuff.com a non-exclusive, worldwide, royalty-free, sublicensable, and transferable license to use, display, distribute, modify, and create derivative works of your User Content in connection with the operation of the Platform.</p>
                    <p style={{ marginBottom: '20px' }}>You are solely responsible for ensuring that you have the necessary rights to share your User Content and that it does not infringe on the intellectual property rights of any third party.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff'
                    }}>5. Platform Usage</h2>
                    <p style={{ marginBottom: '10px' }}>The Platform allows users to share and retrieve information related to room sharing, jobs, and community activities. You may use the Platform only for lawful purposes and in accordance with these Terms. You agree not to:</p>
                    <ul style={{
                        marginBottom: '20px',
                        paddingLeft: '20px',
                        lineHeight: '1.6'
                    }}>
                        <li>Use the Platform to engage in any illegal activity or solicit others to engage in illegal activities.</li>
                        <li>Upload any harmful files, viruses, or malware to the Platform.</li>
                        <li>Disrupt or interfere with the Platform's functionality, servers, or networks.</li>
                    </ul>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff'
                    }}>6. Account Registration and Security</h2>
                    <p style={{ marginBottom: '20px' }}>To use certain features of the Platform, you may need to create an account. When registering, you agree to provide accurate, current, and complete information and to keep your account details up to date. You are responsible for maintaining the confidentiality of your account and password and agree to notify us immediately if you suspect any unauthorized access to your account.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff'
                    }}>7. Privacy and Data Collection</h2>
                    <p style={{ marginBottom: '20px' }}>Your privacy is important to us. Please review our <a href="/policy/privacypolicy" style={{ color: '#d3d3d3' }}>Privacy Policy</a> for information about how we collect, use, and protect your personal data.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff'
                    }}>8. Payment and Subscription</h2>
                    <p style={{ marginBottom: '20px' }}>If the Platform includes any paid features or services (e.g., premium memberships, advertisements), you agree to pay all applicable fees in accordance with the terms of the service. We reserve the right to modify pricing and subscription terms at any time, and you will be notified of such changes.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff'
                    }}>9. Termination and Suspension</h2>
                    <p style={{ marginBottom: '20px' }}>We may suspend or terminate your access to the Platform at our sole discretion, without notice, for any reason, including if you violate these Terms. Upon termination, your right to use the Platform will cease immediately, and you must stop using the Platform.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff'
                    }}>10. Limitation of Liability</h2>
                    <p style={{ marginBottom: '20px' }}>To the fullest extent permitted by law, mangopuff.com is not liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits or data arising from your use of the Platform or any content provided on the Platform, even if we have been advised of the possibility of such damages.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff'
                    }}>11. Indemnification</h2>
                    <p style={{ marginBottom: '20px' }}>You agree to indemnify, defend, and hold harmless mangopuff.com, its affiliates, and their respective officers, directors, employees, agents, and representatives from and against any claims, liabilities, damages, losses, costs, or expenses (including attorneys' fees) arising from your use of the Platform or your violation of these Terms.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff'
                    }}>12. Governing Law and Dispute Resolution</h2>
                    <p style={{ marginBottom: '20px' }}>These Terms will be governed by and construed in accordance with the laws of the [State/Country]. Any disputes arising from or related to these Terms will be resolved through binding arbitration in [location], and you waive any right to participate in a class action or class-wide arbitration.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff'
                    }}>13. Changes to the Terms</h2>
                    <p style={{ marginBottom: '20px' }}>We may update these Terms from time to time. If we make material changes, we will notify you by posting the updated Terms on the Platform or by sending you a notice. Your continued use of the Platform after the changes become effective constitutes your acceptance of the new Terms.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff'
                    }}>14. Severability</h2>
                    <p style={{ marginBottom: '20px' }}>If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions will remain in full force and effect.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff'
                    }}>15. Contact Information</h2>
                    <p style={{ marginBottom: '20px' }}>If you have any questions or concerns about these Terms of Use, please contact us at:</p>

                    <p style={{ marginBottom: '20px' }}>
                        mangopuff.com<br />
                        Email: <a href="mailto:[Your Support Email]" style={{ color: '#d3d3d3' }}>mangopuff.help@gmail.com</a><br />
                    </p>
                </div>
            </div>
        </div>
    );
}
