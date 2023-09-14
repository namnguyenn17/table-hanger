/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import Table from '../../components/table/Table'
import { useHangerDataContext } from '../../contexts/HangerDataContext'
import { HangerData, EnumData } from '../../utils/constants'

const headerMapping = {
  '': '',
  model: 'Model',
  ici: 'Installed Cost',
  wSize: 'Width',
  hSize: 'Height',
  bSize: 'Bearing',
  tfSize: 'TF Depth',
  tfNailQty: 'TF Fasteners',
  hNailQty: 'Face Fasteners',
  jNailQty: 'Joist Fasteners',
  load: 'Download (lbs)',
  uplift: 'Uplift (lbs)',
}

type HangerTableProps = {
  selectedRowData: HangerData[]
  updateModifiedData: (newModifiedData: HangerData[]) => void
}

const headers = Object.keys(headerMapping)

const HangerTable: React.FC<HangerTableProps> = ({ updateModifiedData }) => {
  const { hangersData, enumData } = useHangerDataContext()
  const [modifiedData, setModifiedData] = useState<HangerData[]>([])

  useEffect(() => {
    // Perform the modifications to hangersData based on enumData here
    const updatedData = hangersData.map((row) => {
      // TF Fasteners
      const tfNailQty =
        row.tfNailQty === 0
          ? '-'
          : `(${row.tfNailQty}) ${
              enumData.find((item: EnumData) => item.enum === row.tfNailType)
                ?.displayLabel || ''
            }`

      // Face Fasteners
      const hNailQtyValue = Array.isArray(row.hNailQty)
        ? row.hNailQty[0] === 0
          ? '-'
          : `(${row.hNailQty[0]})`
        : ''

      const hNailQtyLabel = Array.isArray(row.hNailQty)
        ? ` ${
            enumData.find((item: EnumData) => item.enum === row.hNailType[0])
              ?.displayLabel || ''
          }`
        : ''

      const hNailQty = `${hNailQtyValue}${hNailQtyLabel}`

      // Joist Fasteners
      const jNailQty = `(${row.jNailQty}) ${
        enumData.find((item: EnumData) => item.enum === row.jNailType)
          ?.displayLabel || ''
      }`

      return {
        ...row,
        tfSize: row.tfSize === 0 ? '-' : row.tfSize,
        tfNailQty,
        hNailQty,
        jNailQty,
      }
    })

    setModifiedData(updatedData)
    updateModifiedData(updatedData)
  }, [hangersData, enumData])

  return (
    <div className="table-viewer">
      <Table
        headers={headers}
        data={modifiedData}
        headerMapping={headerMapping}
      />
    </div>
  )
}

export default HangerTable
