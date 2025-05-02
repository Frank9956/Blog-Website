export default function About() {
  return (
      <div className='max-h-screen flex items-center justify-center'>
          <div className='max-w-2xl mx-auto p-3 text-center'>
              <div>
                  <h1 className='text-3xl font-semibold text-center my-7'>
                      About RM Group of Education
                  </h1>
                  <div className='text-md text-gray-500 flex flex-col gap-6'>
                      <p>
                          Welcome to RM Group of Education! We are a leading educational consultancy based in Noida, India, specializing in guiding students towards achieving their academic dreams. At RM Group of Education, we focus on providing expert counseling for students pursuing careers in fields such as Medical, Engineering, Law, and various other professional programs, both within India and abroad.
                      </p>

                      <p>
                          Our mission is to help students make informed decisions about their education. Whether it’s preparing for entrance exams, selecting the right college or university, or securing admission in top institutions, we offer end-to-end services. We believe in empowering students with the right information and tools to excel in their chosen paths.
                      </p>

                      <p>
                          RM Group of Education is dedicated to bridging the gap between students and their academic goals. Our expert counselors guide students through the complexities of admissions, scholarships, and entrance exams like NEET, JEE, CLAT, and more. With years of experience, we ensure that every student gets personalized support to make the best choices for their future.
                      </p>

                      <p>
                          In addition to counseling, we provide resources and guidance for studying abroad, helping students choose the right universities, courses, and locations. Whether you’re aiming for a medical degree abroad or pursuing engineering in top institutions, we’re here to guide you every step of the way.
                      </p>

                      <p>
                          We invite you to explore our website and learn more about the services we offer. You can also reach out to us for personalized counseling and assistance with the application process. Together, let’s take the next step in shaping a bright future for you!
                      </p>

                      <p>
                          Learn more about how we can assist you by visiting our website:{" "}
                          <a
                              href="https://www.rmgrouponline.com"
                              target="_blank"
                              className='text-teal-500 hover:underline'
                          >
                            rmgoe.org
                          </a>
                      </p>
                  </div>
              </div>
          </div>
      </div>
  );
}
