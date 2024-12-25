import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import EditSubCategory from '../components/EditSubCategory'
import ConfimBox from '../components/ConfimBox'
import toast from 'react-hot-toast'

const SubCategoryPage = () => {
    const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const columnHelper = createColumnHelper()
    const [ImageURL, setImageURL] = useState('')
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({
        _id: '',
    })
    const [deleteSubCategory, setDeleteSubCategory] = useState({
        _id: '',
    })
    const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false)

    const fetchSubCategory = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getSubCategory,

            })
            const { data: responseData } = response
            if (responseData.success) {
                setData(responseData.data)
                fetchSubCategory()

            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubCategory()
    }, [])
    const column = [
        columnHelper.accessor('name', {
            header: 'Name'
        }),
        columnHelper.accessor('image', {
            header: 'Image',
            cell: ({ row }) => {
                return (
                    <div className='flex items-center justify-center'>
                        <img
                            src={row.original.image}
                            alt={row.original.name}
                            className='w-8 h-8 cursor-pointer'
                            onClick={() => {
                                setImageURL(row.original.image)
                            }}
                        />
                    </div>
                )
            }
        }),
        columnHelper.accessor('category', {
            header: 'Category',
            cell: ({ row }) => {
                return (
                    <>
                        {
                            row.original.category.map((c, index) => {
                                return (
                                    <p key={c._id + "table"} className='shadow-md px-1 inline-block'>{c.name}</p>
                                )
                            })
                        }
                    </>
                )
            }
        }),

        columnHelper.accessor('_id', {
            header: 'Action',
            cell: ({ row }) => {
                return (
                    <div
                        className='flex items-center justify-center gap-1'>
                        <button
                            onClick={() => {
                                setOpenEdit(true);
                                setEditData(row.original)
                            }}
                            className='text-sm border border-primary-100 hover:bg-primary-100 px-3 py-1 rounded'>
                            <HiPencil size={20} />
                        </button>
                        <button
                            onClick={() => {
                                setOpenDeleteConfirmBox(true)
                                setDeleteSubCategory(row.original)
                            }}
                            className='text-sm border border-primary-100 hover:bg-primary-100 px-3 py-1 rounded'>
                            <MdDelete size={20} />
                        </button>
                    </div>
                )
            }
        })

    ]

    const handlDeleteSubCategory = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteSubCategory,
                data: deleteSubCategory
            })

            const { data: responseData } = response
            if (responseData.success) {
                toast.success(responseData.message)
                setOpenDeleteConfirmBox(false)
                fetchSubCategory()
                setDeleteSubCategory({ _id: '' })
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className=''>
            <div className='p-2  bg-white shadow-md flex items-center justify-between'>
                <h2 className='font-semibold'>Sub Category</h2>
                <button onClick={() => setOpenAddSubCategory(true)} className='text-sm border border-primary-200 hover:bg-primary-100 px-3 py-1 rounded'>Add Sub Category</button>
            </div>


            <div className='overflow-auto w-full max-w-[95vw]'>
                <DisplayTable
                    data={data}
                    column={column}
                />
            </div>




            {
                openAddSubCategory && (
                    <UploadSubCategoryModel close={() => setOpenAddSubCategory(false)} />
                )
            }

            {
                ImageURL &&
                <ViewImage url={ImageURL} close={() => setImageURL('')} />
            }

            {
                openEdit &&
                <EditSubCategory
                    data={editData}
                    close={() => setOpenEdit(false)}
                    fetchData={fetchSubCategory}
                />
            }

            {
                openDeleteConfirmBox && (
                    <ConfimBox
                        cancel={() => setOpenDeleteConfirmBox(false)}
                        close={() => setOpenDeleteConfirmBox(false)}
                        confirm={handlDeleteSubCategory}
                    />
                )
            }


        </section>
    )
}

export default SubCategoryPage
