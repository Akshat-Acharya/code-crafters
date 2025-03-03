import React, { useEffect, useState } from 'react'
import { Link, matchPath } from 'react-router-dom'
import logo from '../../assets/Logo/MainLogo.png'
import {NavbarLinks} from '../../data/navbar-links'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import {categories} from '../../services/apis'
import {apiConnector} from '../../services/apiconnector'
import { BsChevronDown } from 'react-icons/bs'


  const subLinks = [
    {
      title: "python",
      link : "/catalog/python"
    },
    {
      title: "webd",
      link : "/catalog/webd"
    }
  ]

const Navbar = () => {

    const {token} = useSelector((state) => state.auth);
    const {user} = useSelector((state) => state.profile);
    const {totalItems} = useSelector((state) => state.cart);
    // const [subLinks,setSubLinks] = useState([]);

  const location = useLocation();
  const matchRoute = (route) => {
      return matchPath({path:route} , location.pathname);
  }

  // const fetchSUbLinks = async() => {
  //   try{

  //     const result = await apiConnector("GET",categories.CATEGORIES_API);
  //     console.log("Printing sub links result : ",result);
  //     setSubLinks(result.data.data);
  //   }
  //   catch(e){
  //       console.log('could not fetch the category and error is : ' , e);
  //   }
  // }


  // useEffect(() => {
  //   //fetchSUbLinks();
  // },[])

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>

        <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
            {/* Image */}
            <Link to='/'>
              <img src={logo} width={160} height={32} loading='lazy'/>
            </Link>

          {/* Nav links */}

        <nav>
          <ul className='flex gap-x-6 text-richblack-25'>
            {
              NavbarLinks.map( (link,index) => (
                <li key={index}>
                  {
                    link.title === 'Catalog' ? (
                        <div className='relative flex items-center gap-2 group'>
                          <p>{link.title}</p>
                          <BsChevronDown/>

                        <div className='invisible absolute left-[50%] translate-x-[-50%] translate-y-[80%] top-[50%]
                        flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all 
                        duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]'>

                        <div className='absolute left-[50%] translate-y-[-45%] translate-x-[80%] top-0 h-6 w-6 rotate-45 rounded bg-richblack-5 '>

                        </div>

                        {
                          subLinks.length ? (
                            
                              subLinks.map((subLink,index) => (
                                <Link to={`${subLink.link}`} key={index}>
                                  <p>{subLink.title}</p>
                                </Link>
                              ))
                            
                          ) : (<div></div>)
                        }   

                        </div>

                        </div>
                    ) : (
                      <Link to={link?.path}>
                        <p className={`${matchRoute(link?.path)?"text-yellow-25":"text-richblack-25"}`}>
                          {link.title}
                        </p>
                      </Link>
                    )
                  }
                </li>
              ))
            }
          </ul>
        </nav>

            {/* Login/SignUp/Dashboard */}

            <div className='flex gap-x-4 items-center'>

              {
                user && user?.accountType != 'Instructor' && (
                  
                  <Link to='/dashboard/cart' className='relative'>
                    <AiOutlineShoppingCart className="text-2xl text-richblack-100"/>
                    {
                      totalItems > 0 && (
                        <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                          {totalItems}
                        </span>
                      )
                    }
                  </Link>

                )
              }
              {
                token == null && (
                  <Link to='/login'>
                    <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]
                    text-richblack-100 rounded-md'>
                      Log in
                    </button>
                  </Link>
                )
              }
              {
                token == null && (
                  <Link to='/signup'>
                    <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px]
                    text-richblack-100 rounded-md'>
                      Sign up
                    </button>
                  </Link>
                )
              }
              {
                token != null && <ProfileDropDown/>
              }
             

            </div>


        </div>

    </div>
  )
}

export default Navbar