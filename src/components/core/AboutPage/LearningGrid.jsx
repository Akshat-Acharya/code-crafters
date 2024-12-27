import React from 'react'
import HighlightText from '../HomePage/HighlightText';
import Button from '../HomePage/Button'

const LearningGridArray = [
    {
      order: -1,
      heading: "World-Class Learning for",
      highliteText: "Anyone, Anywhere",
      description:
        "CodePlay partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
      BtnText: "Learn More",
      BtnLink: "/",
    },
    {
      order: 1,
      heading: "Curriculum Based on Industry Needs",
      description:
        "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
    },
    {
      order: 2,
      heading: "Our Learning Methods",
      description:
        "CodePlay partners with more than 275+ leading universities and companies to bring",
    },
    {
      order: 3,
      heading: "Certification",
      description:
        "CodePlay partners with more than 275+ leading universities and companies to bring",
    },
    {
      order: 4,
      heading: `Rating "Auto-grading"`,
      description:
        "CodePlay partners with more than 275+ leading universities and companies to bring",
    },
    {
      order: 5,
      heading: "Ready to Work",
      description:
        "CodePlay partners with more than 275+ leading universities and companies to bring",
    },
  ];

const LearningGrid = () => {
  return (
    <div className='grid mx-auto grid-cols-1-1 lg:grid-cols-4 mb-10'>
    {
        LearningGridArray.map((card,index) => {
            return (
                <div key={index}
                className={`${index===0 && "lg:col-span-2"}
                
                ${
                card.order%2===1 ? "bg-richblack-700":"bg-richblack-800"
                }
                ${
                    card.order === 3 && "lg:col-start-2"
                }

                `}
                >
                {
                    card.order<0 
                    ? (
                        <div>
                            <div>
                                {card.heading}
                                <HighlightText text={card.highliteText}/>
                            </div>
                            <p>
                                    {card.description}
                            </p>
                            <Button active={true} linkto={card.BtnLink }>
                                {card.BtnText}
                            </Button>
                        </div>
                    )
                    : (
                        <div>
                            <h1>
                                {card.heading}
                            </h1>
                            <p>
                                {card.description}
                            </p>
                        </div>
                    )
                }

                </div>
            )
        })
    }

    </div>
  )
}

export default LearningGrid