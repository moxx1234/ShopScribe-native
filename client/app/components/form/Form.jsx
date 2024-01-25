import { Formik } from 'formik'

const Form = ({ initialValues, onSubmit, schema, children }) => {
	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			validationSchema={schema}
		>
			<>{children}</>
		</Formik>
	)
}

export default Form