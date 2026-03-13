import DepartmentsTabs from "@/components/Features/Dashboard/masters/departments/DepartmentsTabs"

const DeptLayout = ({ children } : Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
        <DepartmentsTabs />
        { children }
    </>
  )
}

export default DeptLayout