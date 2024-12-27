import React from 'react'
import HighlightText from '../components/core/HomePage/HighlightText'
import BannerImage1 from '../assets/Images/aboutus1.webp'
import BannerImage2 from '../assets/Images/aboutus2.webp'
import BannerImage3 from '../assets/Images/aboutus3.webp'
import Quote from '../components/core/AboutPage/Quote'
import FoundingImage from '../assets/Images/FoundingStory.png'
import StatsComponent from '../components/core/AboutPage/StatsComponent'
import LearningGrid from '../components/core/AboutPage/LearningGrid'

const About = () => {
  return (
    <div className='mt-[100px] text-white'>
        {/* section 1 */}
        <section>
            <div>
                <header>
                Driving Innovation in Online Education for a
                <HighlightText text={"Brighter Future"} />
                <p>
                Code Crafters is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
                </p>
                </header>
                <div className='flex gap-x-3 mx-auto'>
                    <img src={BannerImage1} loading='lazy'/>
                    <img src={BannerImage2} loading='lazy'/>
                    <img src={BannerImage3} loading='lazy'/>
                </div>
            </div>
        </section>

        {/* section 2 */}
        <section>
            <div>
                <Quote/>
            </div>
        </section>

        {/*section 3*/}
        <section>
            <div className='flex flex-col'>
            {/* Founding Story vala Div */}
                <div className='flex'>
                {/* Founding Story left Box */}
                    <div>
                        <h1>Our Founding Story</h1>
                        <p> Our e-learning platform was born out of a shared vision and
                passion for transforming education. It all began with a group of
                educators, technologists, and lifelong learners who recognized
                the need for accessible, flexible, and high-quality learning
                opportunities in a rapidly evolving digital world.</p>
                        
                        <p>As experienced educators ourselves, we witnessed firsthand the
                limitations and challenges of traditional education systems. We
                believed that education should not be confined to the walls of a
                classroom or restricted by geographical boundaries. We
                envisioned a platform that could bridge these gaps and empower
                individuals from all walks of life to unlock their full
                potential.</p>
                    </div>
                   {/* Founding Story image box  */}
                    <div>
                        <img src={FoundingImage}/>
                    </div>
                </div>
                {/* vision and mission vala parent div */}
                <div className='flex'>
                    {/* left box */}
                    <div>
                        <h1>Our Vision</h1>
                        <p>With this vision in mind, we set out on a journey to create an
                e-learning platform that would revolutionize the way people
                learn. Our team of dedicated experts worked tirelessly to
                develop a robust and intuitive platform that combines
                cutting-edge technology with engaging content, fostering a
                dynamic and interactive learning experience.</p>
                    </div>

                    {/* right box */}
                    <div>
                        <h1>
                            Our Mission
                        </h1>
                        <p>
                        Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
                        </p>
                    </div>

                </div>

            </div>
        </section>
    
    {/*section 4*/}
    <StatsComponent/>

    {/* section 5 */}
    <section>
        <LearningGrid/>
    </section>


    </div>
  )
}

export default About