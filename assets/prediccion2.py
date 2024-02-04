import numpy as np
import matplotlib.pyplot as plt
import mysql.connector
from datetime import datetime
import os
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression

# Conectar a la base de datos
conexion = mysql.connector.connect(
    host='localhost',
    user='root',
    password='',
    database='bd_panel_solar'
)

cursor = conexion.cursor()

# Ejemplo de consulta SQL
consulta_sql = "SELECT created_at, temperature FROM sensor_data ORDER BY SensorID DESC LIMIT 20"
cursor.execute(consulta_sql)

# Obtener resultados de la consulta
resultados = cursor.fetchall()

# Procesar resultados en arrays NumPy
fechas = np.array([resultado[0] for resultado in resultados])
temperatura = np.array([resultado[1] for resultado in resultados])

# Extraer la hora del día de la columna 'created_at'
hora_del_dia = np.array([datetime.strptime(str(fecha), "%Y-%m-%d %H:%M:%S").hour for fecha in fechas])

# Crear un array 2D con la hora del día como única característica para la predicción de temperatura
X = hora_del_dia.reshape(-1, 1)

# Transformar la característica en una matriz polinómica de segundo grado
poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X)

# Ajustar un modelo de regresión lineal usando NumPy
modelo = LinearRegression()
modelo.fit(X_poly, temperatura)

# Realizar predicciones para la hora del día
hora_prediccion = np.linspace(min(hora_del_dia), max(hora_del_dia), 100).reshape(-1, 1)
hora_prediccion_poly = poly.transform(hora_prediccion)
temperatura_prediccion = modelo.predict(hora_prediccion_poly)

# Visualizar los resultados con Matplotlib
plt.scatter(hora_del_dia, temperatura, label='Datos reales')
plt.plot(hora_prediccion, temperatura_prediccion, color='red', label='Predicción')
plt.xlabel('Hora del día')
plt.ylabel('Temperatura')
plt.legend()
#plt.show()

# Obtener el directorio actual del script
script_directory = os.path.dirname(os.path.abspath(__file__))

# Construir la ruta completa del archivo de imagen
imagen_path = os.path.join(script_directory, 'grafica_prediccion.png')

# Guardar la gráfica en el archivo de imagen
plt.savefig(imagen_path)
# Cerrar la conexión a la base de datos
cursor.close()
conexion.close()
