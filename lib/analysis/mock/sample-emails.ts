import { RawEmail } from '../../types';

/**
 * Sample Emails for Prototype
 * 
 * These emails are designed to demonstrate various threat scenarios
 * and test the analysis engine's heuristic rules.
 */

export const sampleEmails: RawEmail[] = [
  {
    id: '1',
    headers: {
      from: { name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
      to: [{ name: 'John Doe', email: 'john.doe@company.com' }],
      subject: 'Q4 Project Update - Action Required',
      date: new Date('2024-01-15T10:30:00Z'),
      messageId: '<msg123@company.com>',
      returnPath: 'sarah.johnson@company.com',
      spf: 'pass',
      dkim: 'pass',
      dmarc: 'pass',
    },
    body: `Hi John,

I hope this email finds you well. I wanted to follow up on our Q4 project milestones and discuss the timeline for the upcoming deliverables.

Could you please review the attached schedule and let me know if you have any concerns? We need to finalize the approach by Friday to meet our deadline.

Looking forward to your feedback.

Best regards,
Sarah`,
    metadata: {
      ip: '10.0.0.1',
      userAgent: 'Mozilla/5.0',
      timezone: 'America/New_York',
    },
  },
  {
    id: '2',
    headers: {
      from: { name: 'Security Alert', email: 'security@gma1l.com' },
      to: [{ name: 'John Doe', email: 'john.doe@company.com' }],
      subject: 'URGENT: Your account will be suspended in 24 hours',
      date: new Date('2024-01-15T09:15:00Z'),
      messageId: '<msg456@spoofed.com>',
      returnPath: 'phisher@evil-domain.com',
      spf: 'fail',
      dkim: 'fail',
      dmarc: 'fail',
    },
    body: `Dear User,

We have detected unusual activity on your account. Your account will be SUSPENDED within 24 hours unless you take immediate action.

To verify your identity and restore your account access, please click here immediately:

http://bit.ly/verify-account-now
https://evil-domain.com/login

You must enter your password and username to confirm your identity. This is required to protect your account security.

ACT NOW TO AVOID ACCOUNT LOSS!

Security Team`,
    metadata: {
      ip: '203.0.113.1',
      userAgent: 'Unknown',
      timezone: 'Europe/Moscow',
    },
  },
  {
    id: '3',
    headers: {
      from: { name: 'CEO Michael Roberts', email: 'michael.roberts@executive-corp.com' },
      to: [{ name: 'John Doe', email: 'john.doe@company.com' }],
      subject: 'Urgent: Wire Transfer Request - Confidential',
      date: new Date('2024-01-15T08:00:00Z'),
      messageId: '<msg789@executive-corp.com>',
      returnPath: 'michael.roberts@executive-corp.com',
      spf: 'neutral',
      dkim: 'neutral',
      dmarc: 'neutral',
    },
    body: `John,

I need you to process an urgent wire transfer for me immediately. This is confidential and time-sensitive.

Please transfer $50,000 to the following account:
- Bank: International Bank
- Account: 1234567890
- Routing: 987654321

Payment details: https://executive-corp.com/wire-transfer

This is for a vendor payment that must be completed today. Do not discuss this with anyone else.

I'm in a meeting and cannot talk, but trust me on this.

Regards,
Michael Roberts
CEO`,
    metadata: {
      ip: '198.51.100.1',
      userAgent: 'Mozilla/5.0',
      timezone: 'Asia/Shanghai',
    },
  },
  {
    id: '4',
    headers: {
      from: { name: 'Tech Deals Weekly', email: 'deals@tech-promos.com' },
      to: [{ name: 'John Doe', email: 'john.doe@company.com' }],
      subject: '🔥 Flash Sale: 70% Off Premium Software',
      date: new Date('2024-01-14T16:45:00Z'),
      messageId: '<msg999@tech-promos.com>',
      returnPath: 'deals@tech-promos.com',
      spf: 'pass',
      dkim: 'pass',
      dmarc: 'pass',
    },
    body: `Hi John,

Don't miss our biggest sale of the year! Get premium software at incredible discounts:

✅ 70% Off Office Suite
✅ 60% Off Security Software  
✅ 50% Off Cloud Storage

Click here to shop now: https://tech-promos.com/sale
https://tech-promos.com/deals/office
https://tech-promos.com/deals/security

This offer expires in 24 hours. Use code: FLASH70

To unsubscribe, click here: https://tech-promos.com/unsubscribe

Best,
The Tech Deals Team`,
    metadata: {
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      timezone: 'America/Los_Angeles',
    },
  },
  {
    id: '5',
    headers: {
      from: { name: 'David Chen', email: 'david.chen@company.com' },
      to: [{ name: 'John Doe', email: 'john.doe@company.com' }],
      subject: 'Meeting Notes: Product Strategy Discussion',
      date: new Date('2024-01-14T14:20:00Z'),
      messageId: '<msg555@company.com>',
      returnPath: 'david.chen@company.com',
      spf: 'pass',
      dkim: 'pass',
      dmarc: 'pass',
    },
    body: `Hi John,

Here are the notes from today's product strategy meeting:

Key Points:
- Q1 roadmap finalized
- New feature set approved
- Timeline: 8 weeks to launch
- Budget allocation confirmed

Action Items:
- John: Finalize technical specs by Friday
- David: Update project timeline
- Team: Begin sprint planning next week

Let me know if you have any questions.

Best,
David`,
    metadata: {
      ip: '10.0.0.1',
      userAgent: 'Mozilla/5.0',
      timezone: 'America/New_York',
    },
  },
  {
    id: '6',
    headers: {
      from: { name: 'Newsletter Digest', email: 'news@marketing-firm.com' },
      to: [{ name: 'John Doe', email: 'john.doe@company.com' }],
      subject: 'This Week in Tech: AI Innovations and Market Trends',
      date: new Date('2024-01-13T11:00:00Z'),
      messageId: '<msg666@marketing-firm.com>',
      returnPath: 'news@marketing-firm.com',
      spf: 'pass',
      dkim: 'pass',
      dmarc: 'pass',
    },
    body: `Hello John,

This week's tech highlights:

🤖 AI Breakthroughs: New models achieving human-level performance
📱 Mobile Trends: App usage statistics for Q4
💼 Business: Remote work productivity insights
🔒 Security: Latest cybersecurity threats and protections

Read the full analysis on our blog.

Unsubscribe | Manage Preferences
The Marketing Team`,
    metadata: {
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      timezone: 'America/Chicago',
    },
  },
  {
    id: '7',
    headers: {
      from: { name: 'Winner Notification', email: 'prize@lottery-scam.com' },
      to: [{ name: 'John Doe', email: 'john.doe@company.com' }],
      subject: 'CONGRATULATIONS! You have won $2,500,000',
      date: new Date('2024-01-13T09:30:00Z'),
      messageId: '<msg777@lottery-scam.com>',
      returnPath: 'prize@lottery-scam.com',
      spf: 'fail',
      dkim: 'fail',
      dmarc: 'fail',
    },
    body: `DEAR WINNER,

You have been selected as the lucky winner of our international lottery program!

PRIZE: $2,500,000 USD

To claim your prize, please send us:
- Your full name
- Address
- Phone number
- Bank account details
- Processing fee of $500

Act now! This offer expires in 48 hours.

Contact us immediately: winner@lottery-scam.com

Congratulations!
Lottery Commission`,
    metadata: {
      ip: '203.0.113.1',
      userAgent: 'Unknown',
      timezone: 'Europe/Moscow',
    },
  },
  {
    id: '8',
    headers: {
      from: { name: 'HR Department', email: 'hr@company.com' },
      to: [{ name: 'John Doe', email: 'john.doe@company.com' }],
      subject: 'Updated Employee Handbook - Please Review',
      date: new Date('2024-01-12T16:00:00Z'),
      messageId: '<msg888@company.com>',
      returnPath: 'hr@company.com',
      spf: 'pass',
      dkim: 'pass',
      dmarc: 'pass',
    },
    body: `Dear John,

We have updated the Employee Handbook with new policies effective February 1st.

Key changes:
- Remote work policy updates
- New security protocols
- Updated benefits information
- Travel expense guidelines

Please review the attached document and acknowledge receipt by January 20th.

Thank you,
Human Resources`,
    metadata: {
      ip: '10.0.0.1',
      userAgent: 'Mozilla/5.0',
      timezone: 'America/New_York',
    },
  },
  {
    id: '9',
    headers: {
      from: { name: 'Amazon Security', email: 'verify@amazonn-secure.com' },
      to: [{ name: 'John Doe', email: 'john.doe@company.com' }],
      subject: 'Verify your Amazon account - Unusual login detected',
      date: new Date('2024-01-12T08:45:00Z'),
      messageId: '<msg999@amazonn-secure.com>',
      returnPath: 'verify@amazonn-secure.com',
      spf: 'fail',
      dkim: 'fail',
      dmarc: 'fail',
    },
    body: `Dear Customer,

We detected an unusual login to your Amazon account from a new device.

Device: iPhone 14
Location: Russia
IP: 203.0.113.1

If this was not you, please verify your account immediately:

https://amazonn-secure.com/verify-account
https://amazonn-secure.com/login/reset

Enter your Amazon password and confirm your identity to secure your account.

Amazon Security Team`,
    metadata: {
      ip: '203.0.113.1',
      userAgent: 'Unknown',
      timezone: 'Europe/Moscow',
    },
  },
  {
    id: '10',
    headers: {
      from: { name: 'Emily Watson', email: 'emily.watson@company.com' },
      to: [{ name: 'John Doe', email: 'john.doe@company.com' }],
      subject: 'Invoice attached - Project Alpha Services',
      date: new Date('2024-01-11T15:30:00Z'),
      messageId: '<msg1010@company.com>',
      returnPath: 'emily.watson@company.com',
      spf: 'pass',
      dkim: 'pass',
      dmarc: 'pass',
    },
    body: `Hi John,

Please find attached the invoice for Project Alpha services completed in December.

Invoice #INV-2024-001
Amount: $15,000
Due Date: January 31, 2024

Payment can be made via bank transfer or check. Let me know if you have any questions.

Best regards,
Emily Watson
Finance Department`,
    attachments: [
      {
        filename: 'Invoice_INV-2024-001.pdf',
        contentType: 'application/pdf',
        size: 245760,
      },
    ],
    metadata: {
      ip: '10.0.0.1',
      userAgent: 'Mozilla/5.0',
      timezone: 'America/New_York',
    },
  },
];

export function getSampleEmail(id: string): RawEmail | undefined {
  return sampleEmails.find(email => email.id === id);
}

export function getAllSampleEmails(): RawEmail[] {
  return sampleEmails;
}
