import logo from './logo.svg';
import './App.css';
import {
    useQuery,
    gql, useSubscription, useMutation
} from "@apollo/client";
import {useState} from "react";
import {getToken} from "./index";

const PERSONS = gql`
  query Persons {
    persons {
      shortName
      email
      name
    }
  }
`;



const ADD_PERSON_MUTATION = gql`
  mutation AddPerson($shortName: String!, $email: String!, $name: String!) {
    addPerson(person: { shortName: $shortName, email: $email, name: $name, updatedBy: "Sindre"}) {
      shortName
      email
      name
    }
  }
`;

const PERSONS_SUBSCRIPTION = gql`
  subscription PersonAdded {
    personAdded{
      name
    }
  }
`;

function AddPerson() {
    const [addPerson, { data, loading, error }] = useMutation(ADD_PERSON_MUTATION);

    const [formData, setFormData] = useState({
        shortName: "",
        email: "",
        name: ""
    })

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;



    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    addPerson({ variables: { ...formData } });
                }}
            >
                <label htmlFor="title">Email</label>
                <input onChange={(e) => setFormData({...formData, email: e.target.value})} value={formData.email} type="text" name="title" id="title" /><br/>
                <label htmlFor="shortname">Shortname</label>
                <input onChange={(e) => setFormData({...formData, shortName: e.target.value})} value={formData.shortName} type="text" name="title" id="title" /><br/>
                <label htmlFor="name">Name</label>
                <input onChange={(e) => setFormData({...formData, name: e.target.value})} value={formData.name} type="text" name="title" id="title" /><br/>
                <button type="submit">Add Person</button>
            </form>
        </div>
    );
}


function LatestPerson() {

    const { data, error, loading } = useSubscription(
        PERSONS_SUBSCRIPTION,
        {}
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return <h4>New person: {!loading && data.personAdded.name}</h4>;
}


function ListPersons() {
  const { loading, error, data } = useQuery(PERSONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.persons.map(({ shortName, email, name }) => (
      <div key={shortName}>
        <p>
          {email}: {name}
        </p>
      </div>
  ));
}

export const setToken = (token) =>  localStorage.setItem("access_token", token);

function SetToken() {
    const [addPerson, { data, loading, error }] = useMutation(ADD_PERSON_MUTATION);

    const [formData, setFormData] = useState({
        token: localStorage.getItem("access_token"),
    })

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    setToken(formData.token);
                }}
            >
                <textarea onChange={(e) => setFormData({...formData, token: e.target.value})} value={formData.email} type="text" name="title" id="title" />
                <br/>
                <button type="submit">Set token</button>
            </form>
        </div>
    );
}


function App() {
  return (
    <div className="App">
        <h1>List</h1>
        <ListPersons />
        <h1>Add</h1>
        <AddPerson />
        <h1>Latest person</h1>
        <LatestPerson />
        <h1>Set token</h1>
        <SetToken />
    </div>
  );
}

export default App;
