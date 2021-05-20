FROM python:3.6
COPY requirements.txt /tmp
RUN pip3 install -U setuptools
RUN pip3 install -r /tmp/requirements.txt
RUN pip3 install -U pip google-api-python-client
COPY /src /app
COPY . /app
WORKDIR /app

EXPOSE 3004
CMD ["python3", "mock_app.py"]