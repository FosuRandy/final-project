import React, { useState } from 'react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
        question: "How does HelpFund work?",
        answer: "HelpFund allows individuals and organizations to create campaigns to raise money for various causes. Users can create a campaign, share it with their network, and collect donations from supporters."
    },
    {
        question: "What fees does HelpFund charge?",
        answer: "HelpFund charges a small percentage fee on each donation to cover operational costs. Details about the specific fee structure can be found on our Fees page."
    },
    {
        question: "Is my donation secure?",
        answer: "Yes, HelpFund uses industry-standard encryption and security measures to ensure that your donation information is safe and secure."
    },
    {
        question: "How do I start a campaign?",
        answer: "To start a campaign, sign up for an account, click on the 'Start a Campaign' button, and follow the step-by-step instructions to set up your campaign page."
    },
    {
        question: "Can I update my campaign after it has been published?",
        answer: "Yes, you can update your campaign details, add new photos and videos, and post updates to keep your supporters informed about your progress."
    },
    {
        question: "What happens if my campaign doesn’t reach its goal?",
        answer: "Even if your campaign doesn't reach its goal, you will still receive the funds raised (minus the HelpFund fee). The only exception is for campaigns marked as 'All or Nothing,' which will return funds to donors if the goal is not met."
    }
];


  return (
<div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
  <div className="grid md:grid-cols-5 gap-10">
    <div className="md:col-span-2">
      <div className="max-w-xs">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white">Frequently<br/>asked questions</h2>
        <p className="mt-1 hidden md:block text-gray-600 dark:text-neutral-400">Answers to the most frequently asked questions.</p>
      </div>
    </div>

    <div className="md:col-span-3">
          <div className="hs-accordion-group divide-y divide-gray-200 dark:divide-neutral-700">
            {faqs.map((faq, index) => (
              <div key={index} className={`hs-accordion pt-6 pb-3 ${activeIndex === index ? 'active' : ''}`} id={`hs-basic-with-title-and-arrow-stretched-heading-${index}`}>
                <button
                  className="hs-accordion-toggle group pb-3 inline-flex items-center justify-between gap-x-3 w-full md:text-lg font-semibold text-start text-gray-800 rounded-lg transition hover:text-gray-500 dark:text-neutral-200 dark:hover:text-neutral-400"
                  aria-controls={`hs-basic-with-title-and-arrow-stretched-collapse-${index}`}
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <svg className="hs-accordion-active:hidden block flex-shrink-0 size-5 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  <svg
                    className={`hs-accordion-active:${activeIndex !== index ? 'block' : 'hidden'} hidden flex-shrink-0 size-5 text-gray-600 group-hover:text-gray-500 dark:text-neutral-400`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <div
                  id={`hs-basic-with-title-and-arrow-stretched-collapse-${index}`}
                  className={`hs-accordion-content w-full overflow-hidden transition-[height] duration-300 ${activeIndex === index ? 'block' : 'hidden'}`}
                  aria-labelledby={`hs-basic-with-title-and-arrow-stretched-heading-${index}`}
                >
                  <p className="text-gray-600 dark:text-neutral-400">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
  </div>
</div>
  )
}

export default FAQ;