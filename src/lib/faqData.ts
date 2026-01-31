export interface FAQItem {
    id: string;
    question: string;
    answer: string;
    keywords: string[];
    category: 'registration' | 'teams' | 'submission' | 'judging' | 'prizes' | 'technical';
}

export const faqData: FAQItem[] = [
    // Registration & Eligibility
    {
        id: 'reg-1',
        question: 'How do I register for FixForward?',
        answer: 'Click "Register" on the landing page and sign in with your Google account. Complete the onboarding form with your details, and you\'re all set!',
        keywords: ['register', 'sign up', 'join', 'account', 'start'],
        category: 'registration',
    },
    {
        id: 'reg-2',
        question: 'Who can participate in FixForward?',
        answer: 'FixForward is open to all students enrolled in any college or university. There are no restrictions on year of study or field of study.',
        keywords: ['eligibility', 'who', 'participate', 'student', 'college', 'university', 'allowed'],
        category: 'registration',
    },
    {
        id: 'reg-3',
        question: 'Is there a registration fee?',
        answer: 'No! FixForward is completely free to participate. There are no hidden charges or fees.',
        keywords: ['fee', 'cost', 'money', 'pay', 'free', 'charge'],
        category: 'registration',
    },
    {
        id: 'reg-4',
        question: 'What is the registration deadline?',
        answer: 'Check the countdown timer on your dashboard for the exact deadline. Make sure to register and form your team before the deadline to participate.',
        keywords: ['deadline', 'when', 'last date', 'time', 'registration closes'],
        category: 'registration',
    },

    // Teams
    {
        id: 'team-1',
        question: 'How do I create a team?',
        answer: 'Go to your dashboard and click "Create Team". Enter a team name, choose a theme, and select your role. You\'ll be the team leader and can invite others using your team code.',
        keywords: ['create', 'team', 'start', 'form', 'new team', 'make'],
        category: 'teams',
    },
    {
        id: 'team-2',
        question: 'How do I join an existing team?',
        answer: 'You can either search for teams and send a join request, or enter a team\'s unique invite code. The team leader will need to approve your request.',
        keywords: ['join', 'team', 'request', 'invite', 'code', 'existing'],
        category: 'teams',
    },
    {
        id: 'team-3',
        question: 'What is the team size limit?',
        answer: 'Teams can have 1-4 members. Solo participation is allowed, but we recommend teams of 2-4 for diverse skill sets.',
        keywords: ['size', 'limit', 'members', 'many', 'people', 'solo'],
        category: 'teams',
    },
    {
        id: 'team-4',
        question: 'Can I change my team after registration?',
        answer: 'You can leave your current team and join another before the registration deadline. However, once submissions start, team changes are locked.',
        keywords: ['change', 'switch', 'leave', 'team', 'different'],
        category: 'teams',
    },
    {
        id: 'team-5',
        question: 'Who can submit the idea for our team?',
        answer: 'Only the team leader (the person who created the team) can submit and edit the idea. Team members can view but not modify the submission.',
        keywords: ['submit', 'leader', 'edit', 'permission', 'who', 'submission'],
        category: 'teams',
    },

    // Submission
    {
        id: 'sub-1',
        question: 'What do I need to submit in Phase 1?',
        answer: 'In Phase 1, submit your problem statement (what issue you\'re solving), evidence of the problem, your proposed solution, target audience, and potential impact.',
        keywords: ['phase 1', 'submit', 'idea', 'what', 'required', 'need'],
        category: 'submission',
    },
    {
        id: 'sub-2',
        question: 'What is Phase 2 about?',
        answer: 'Phase 2 is the prototype phase. Shortlisted teams submit their working prototype, pitch deck, demo video, and execution plan.',
        keywords: ['phase 2', 'prototype', 'build', 'develop', 'next'],
        category: 'submission',
    },
    {
        id: 'sub-3',
        question: 'Can I edit my submission after submitting?',
        answer: 'Yes, you can edit your submission until the deadline passes. After the deadline, all submissions are locked for judging.',
        keywords: ['edit', 'change', 'modify', 'update', 'after', 'submission'],
        category: 'submission',
    },
    {
        id: 'sub-4',
        question: 'What file formats are accepted?',
        answer: 'For documents, we accept PDF. For pitch decks, PDF or presentation links (Google Slides, Figma). For videos, links to YouTube, Loom, or Google Drive.',
        keywords: ['format', 'file', 'type', 'pdf', 'video', 'upload', 'accept'],
        category: 'submission',
    },
    {
        id: 'sub-5',
        question: 'What are the solution tracks?',
        answer: 'FixForward has multiple tracks: Healthcare, Education, Environment, Financial Inclusion, and Open Innovation. Choose the one that best fits your solution.',
        keywords: ['track', 'category', 'domain', 'theme', 'area'],
        category: 'submission',
    },

    // Judging
    {
        id: 'judge-1',
        question: 'How is my submission judged?',
        answer: 'Submissions are evaluated on: Problem clarity (20%), Solution innovation (30%), Feasibility (25%), and Impact potential (25%). Multiple judges review each submission independently.',
        keywords: ['judge', 'evaluate', 'criteria', 'score', 'how', 'grading'],
        category: 'judging',
    },
    {
        id: 'judge-2',
        question: 'When will results be announced?',
        answer: 'Results are announced after each phase completes. Check your dashboard and the public leaderboard for updates. You\'ll also receive an email notification.',
        keywords: ['results', 'when', 'announce', 'winner', 'outcome'],
        category: 'judging',
    },
    {
        id: 'judge-3',
        question: 'Who are the judges?',
        answer: 'Our jury includes industry experts, startup founders, and academic leaders. Check the Jury section on our homepage for full profiles.',
        keywords: ['judges', 'who', 'jury', 'panel', 'experts'],
        category: 'judging',
    },

    // Prizes
    {
        id: 'prize-1',
        question: 'What are the prizes?',
        answer: 'Winners receive cash prizes, mentorship opportunities, incubation support, and certificates. Check the Prizes section on our homepage for exact amounts.',
        keywords: ['prize', 'win', 'reward', 'money', 'award', 'what'],
        category: 'prizes',
    },
    {
        id: 'prize-2',
        question: 'Do all participants get a certificate?',
        answer: 'Yes! All participants who complete their submission receive a participation certificate. Winners get special achievement certificates.',
        keywords: ['certificate', 'participation', 'everyone', 'all'],
        category: 'prizes',
    },

    // Technical
    {
        id: 'tech-1',
        question: 'I\'m having trouble logging in',
        answer: 'Try clearing your browser cache and cookies, then log in again. Make sure you\'re using the same Google account you registered with. If issues persist, contact support.',
        keywords: ['login', 'cant', 'trouble', 'error', 'access', 'problem'],
        category: 'technical',
    },
    {
        id: 'tech-2',
        question: 'My submission isn\'t saving',
        answer: 'Auto-save happens every 2 seconds. If you see issues, check your internet connection. Try refreshing the page. Your drafts are saved to the cloud.',
        keywords: ['save', 'saving', 'lost', 'draft', 'not working'],
        category: 'technical',
    },
    {
        id: 'tech-3',
        question: 'How do I contact support?',
        answer: 'Email us at fixforward.hyrup@gmail.com with your registered email, team name (if applicable), and a description of your issue. We typically respond within 24 hours.',
        keywords: ['contact', 'support', 'help', 'email', 'reach'],
        category: 'technical',
    },
];

/**
 * Find matching FAQ items based on query
 */
export function findFAQMatches(query: string, maxResults: number = 3): FAQItem[] {
    const normalizedQuery = query.toLowerCase().trim();

    if (!normalizedQuery) return [];

    // Score each FAQ item
    const scored = faqData.map(faq => {
        let score = 0;

        // Check keywords
        faq.keywords.forEach(keyword => {
            if (normalizedQuery.includes(keyword.toLowerCase())) {
                score += 10;
            }
            // Fuzzy match (partial)
            if (keyword.toLowerCase().includes(normalizedQuery) ||
                normalizedQuery.includes(keyword.toLowerCase().slice(0, 3))) {
                score += 5;
            }
        });

        // Check question text
        if (faq.question.toLowerCase().includes(normalizedQuery)) {
            score += 15;
        }

        // Word overlap
        const queryWords = normalizedQuery.split(' ').filter(w => w.length > 2);
        queryWords.forEach(word => {
            if (faq.question.toLowerCase().includes(word)) score += 3;
            if (faq.answer.toLowerCase().includes(word)) score += 1;
        });

        return { faq, score };
    });

    // Sort by score and return top matches
    return scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
        .map(item => item.faq);
}

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(category: FAQItem['category']): FAQItem[] {
    return faqData.filter(faq => faq.category === category);
}
