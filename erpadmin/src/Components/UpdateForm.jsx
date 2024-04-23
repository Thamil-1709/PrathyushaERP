import React from 'react'
import Header from './Header'
import Card from './Card'

const UpdateForm = () => {
  const [formData, setFormData] = useState(new FormData());
   const getData = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/get'
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }   }


  return (
    <div className='text-dark col-12 grid-margin stretch-card'>
      <Header name={`Update ${props.Title} Details`} description='Update Bus Details' />
      <br />
      <div>

        <Card Title={props.formTitle}>

          {props.fields.map((field, index) => (
            <FormGroup
              key={index}
              FieldlName={field.name}
              type={field.type}
              parentCallback={handleCallBack}
              value={field.value}

            />
          ))}
          <button className="btn btn-primary" type="button" onClick={sendData}>
            Submit
          </button>
        </Card>
      </div>
    </div>
  )
}
export default UpdateForm