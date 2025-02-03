import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import fetchCourseCategories from '../../../../services/operations/courseDetailAPI'
const CourseInformationForm = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState:{errors},
    } = useForm();

    const dispatch = useDispatch();
    const {course,editCourse} = useSelector((state) => state.course);
    const [loading,setLoading] = useState(false);
    const [courseCategory,setCourseCategory] = useState([]);

    useEffect(() => {
        const getCategories = async () => {
            setLoading(true);
            const categories = await fetchCourseCategories()
            if(categories.length > 0){
              setCourseCategory(categories);
            }
            setLoading(false);
        }
        if(editCourse){
          setValue("courseTitle",course.courseName);
          setValue("courseShortDesc", course.courseDescription)
            setValue("coursePrice", course.price)
            setValue("courseTags", course.tag)
            setValue("courseBenefits", course.whatYouWillLearn)
            setValue("courseCategory", course.category)
            setValue("courseRequirements", course.instructions)
            setValue("courseImage", course.thumbnail)
        }
        getCategories();
    },[]) 
    const onSubmit = async (data) => {
      // console.log(data)
  
      if (editCourse) {
        // const currentValues = getValues()
        // console.log("changes after editing form values:", currentValues)
        // console.log("now course:", course)
        // console.log("Has Form Changed:", isFormUpdated())
        if (isFormUpdated()) {
          const currentValues = getValues()
          const formData = new FormData()
          // console.log(data)
          formData.append("courseId", course._id)
          if (currentValues.courseTitle !== course.courseName) {
            formData.append("courseName", data.courseTitle)
          }
          if (currentValues.courseShortDesc !== course.courseDescription) {
            formData.append("courseDescription", data.courseShortDesc)
          }
          if (currentValues.coursePrice !== course.price) {
            formData.append("price", data.coursePrice)
          }
          if (currentValues.courseTags.toString() !== course.tag.toString()) {
            formData.append("tag", JSON.stringify(data.courseTags))
          }
          if (currentValues.courseBenefits !== course.whatYouWillLearn) {
            formData.append("whatYouWillLearn", data.courseBenefits)
          }
          if (currentValues.courseCategory._id !== course.category._id) {
            formData.append("category", data.courseCategory)
          }
          if (
            currentValues.courseRequirements.toString() !==
            course.instructions.toString()
          ) {
            formData.append(
              "instructions",
              JSON.stringify(data.courseRequirements)
            )
          }
          if (currentValues.courseImage !== course.thumbnail) {
            formData.append("thumbnailImage", data.courseImage)
          }
          // console.log("Edit Form data: ", formData)
          setLoading(true)
          const result = await editCourseDetails(formData, token)
          setLoading(false)
          if (result) {
            dispatch(setStep(2))
            dispatch(setCourse(result))
          }
        } else {
          toast.error("No changes made to the form")
        }
        return
      }
  
      const formData = new FormData()
      formData.append("courseName", data.courseTitle)
      formData.append("courseDescription", data.courseShortDesc)
      formData.append("price", data.coursePrice)
      formData.append("tag", JSON.stringify(data.courseTags))
      formData.append("whatYouWillLearn", data.courseBenefits)
      formData.append("category", data.courseCategory)
      formData.append("status", COURSE_STATUS.DRAFT)
      formData.append("instructions", JSON.stringify(data.courseRequirements))
      formData.append("thumbnailImage", data.courseImage)
      setLoading(true)
      const result = await addCourseDetails(formData, token)
      if (result) {
        dispatch(setStep(2))
        dispatch(setCourse(result))
      }
      setLoading(false)
    }

  return (
    <div>
        
    </div>
  )
}

export default CourseInformationForm