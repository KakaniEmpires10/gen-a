import MastersTabs from "@/components/Features/Dashboard/masters/MastersTabs"

const MasterLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <>
            <div className="flex justify-center">
                <MastersTabs />
            </div>
            {children}
        </>
    )
}

export default MasterLayout