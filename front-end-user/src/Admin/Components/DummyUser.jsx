import React from 'react'
import DummyUserMain from './DummyUserMain'
import AdminPanel from './Admin'

function DummyUser() {
  return (
    <AdminPanel>
        <DummyUserMain/>
    </AdminPanel>
  )
}

export default DummyUser