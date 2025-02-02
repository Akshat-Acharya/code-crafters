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
        }
    })

  return (
    <div>
        
    </div>
  )
}

export default CourseInformationForm