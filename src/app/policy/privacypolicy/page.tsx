import React from 'react';
import Logo from "../../component/logo";

export default function PrivacyPolicy() {
    return (
        <div>
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                backgroundColor: '#1c1c1c',
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
                backgroundColor: '#1c1c1c',
                padding: '20px',
                color: '#fff',
                paddingTop: '60px',
            }}>
                <div style={{
                    maxWidth: '800px',
                    width: '100%',
                    backgroundColor: '#333',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                    lineHeight: '1.6',
                }}>
                    <h1 style={{
                        textAlign: 'center',
                        marginBottom: '20px',
                        color: '#fff',
                    }}>Privacy Policy</h1>
                    <p style={{ fontSize: '16px', marginBottom: '20px' }}><strong>Effective Date:</strong> January 1st 2025</p>

                    <p style={{ marginBottom: '20px' }}>This Privacy Policy explains how we collect, use, and share information about you when you use our services, including through our website and mobile app ("Platform"). We respect your privacy and are committed to protecting your personal data.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff',
                    }}>1. Information We Collect</h2>
                    <p style={{ marginBottom: '20px' }}>We collect the following types of information to improve your experience:</p>
                    <ul style={{ marginBottom: '20px' }}>
                        <li><strong>Personal Information:</strong> We collect information such as your email address, phone number, and home address when you sign up or provide this information through the Platform.</li>
                        <li><strong>Location Data:</strong> We collect your geographic location to provide personalized services based on your location, such as showing nearby locations or events.</li>
                        <li><strong>Device Information:</strong> We may collect information about the device you use to access our Platform, including your IP address, operating system, and browser type.</li>
                    </ul>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff',
                    }}>2. How We Use Your Information</h2>
                    <p style={{ marginBottom: '20px' }}>We use your information to:</p>
                    <ul style={{ marginBottom: '20px' }}>
                        <li>Provide, operate, and improve the Platform's features and functionality, such as location-based services.</li>
                        <li>Send you account-related information, such as updates, promotions, and notifications.</li>
                        <li>Customize and personalize your experience based on your preferences and location.</li>
                        <li>Respond to your inquiries and provide customer support.</li>
                        <li>Analyze usage trends to improve our services and optimize the user experience.</li>
                    </ul>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff',
                    }}>3. Sharing Your Information</h2>
                    <p style={{ marginBottom: '20px' }}>We may share your information in the following circumstances:</p>
                    <ul style={{ marginBottom: '20px' }}>
                        <li><strong>With Service Providers:</strong> We may share your information with third-party companies that provide services to help us operate the Platform, such as hosting, analytics, and customer support.</li>
                        <li><strong>To Comply with Legal Obligations:</strong> We may share your information when required by law or to respond to a legal process, such as a subpoena or court order.</li>
                        <li><strong>For Business Transfers:</strong> If we are involved in a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.</li>
                    </ul>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff',
                    }}>4. Data Security</h2>
                    <p style={{ marginBottom: '20px' }}>We take reasonable steps to protect the information we collect from unauthorized access, use, or disclosure. However, no security system is perfect, and we cannot guarantee the security of your data transmitted to the Platform.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff',
                    }}>5. Your Choices</h2>
                    <p style={{ marginBottom: '20px' }}>You can control the information we collect and how it is used:</p>
                    <ul style={{ marginBottom: '20px' }}>
                        <li><strong>Opt-out of Location Services:</strong> You can disable location tracking in your device's settings, but this may limit certain features of the Platform.</li>
                        <li><strong>Update or Delete Your Information:</strong> You can update or delete your personal information by accessing your account settings.</li>
                        <li><strong>Marketing Communications:</strong> You can opt-out of receiving promotional emails by clicking the "unsubscribe" link in the emails we send you.</li>
                    </ul>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff',
                    }}>6. Children's Privacy</h2>
                    <p style={{ marginBottom: '20px' }}>Our Platform is not intended for children under the age of 13, and we do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 13, we will take steps to delete that information.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff',
                    }}>7. Changes to This Privacy Policy</h2>
                    <p style={{ marginBottom: '20px' }}>We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on the Platform. Please review this Privacy Policy periodically for any updates.</p>

                    <h2 style={{
                        marginBottom: '10px',
                        color: '#fff',
                    }}>8. Contact Us</h2>
                    <p style={{ marginBottom: '20px' }}>If you have any questions or concerns about this Privacy Policy or our practices, please contact us at:</p>
                    <p style={{ marginBottom: '20px' }}><strong>Email:</strong> support@mangopuff.com</p>
                    <p style={{ marginBottom: '20px' }}><strong>Phone:</strong> +1 (800) 123-4567</p>
                    <p style={{ marginBottom: '20px' }}><strong>Address:</strong> 123 Mango Street, Suite 100, City, State, ZIP Code</p>
                </div>
            </div>
        </div>
    );
}
