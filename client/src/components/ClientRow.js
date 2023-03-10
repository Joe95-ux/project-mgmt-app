import {FaTrash} from 'react-icons/fa'
import {useMutation} from '@apollo/client';
import {DELETE_CLIENT} from '../mutations/clientMutations';
import {GET_CLIENTS } from '../queries/clientQueries';
import {GET_PROJECTS} from "../queries/projectQueries";

function ClientRow({client}) {
  const [deleteClient] = useMutation( DELETE_CLIENT, {
    variables: {id: client.id},
    // after deleting client, refetch clients and projects
    // to reflect delete of client, we need to refetch all clients afer delete action
    refetchQueries: [{query: GET_CLIENTS}, {query: GET_PROJECTS}]
    // not the best way however. best to update the cache instead
    // update(cache, {data: {deleteClient}}){
    //     const {clients}  = cache.readQuery({query: GET_CLIENTS});
    //     cache.writeQuery({
    //         query: GET_CLIENTS,
    //         data: {clients: clients.filter(client=>client.id !== deleteClient.id)}
    //     });
    // }

  })
  return (
    <tr>
       <td>{client.name}</td>
       <td>{client.email}</td>
       <td>{client.phone}</td>
       <td>
         <button className='btn btn-danger btn-sm' onClick={deleteClient}>
            <FaTrash/>
         </button>
       </td>

    </tr>
  )
}

export default ClientRow