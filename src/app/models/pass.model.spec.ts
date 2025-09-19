import { Pass, PostPass } from './pass.model';

describe('Pass Model', () => {
  it('should create an instance with all properties set from object', () => {
    const obj = {
      pk: 'pk1',
      sk: 'sk1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      type: 'AM',
      numberOfGuests: 2,
      registrationNumber: 'REG123',
      facilityName: 'Facility 1',
      date: new Date('2024-01-01'),
      passStatus: 'ACTIVE',
      phoneNumber: '1234567890',
      facilityType: 'Parking',
      license: 'LIC123'
    };
    const pass = new Pass(obj);
    expect(pass.pk).toBe(obj.pk);
    expect(pass.sk).toBe(obj.sk);
    expect(pass.email).toBe(obj.email);
    expect(pass.firstName).toBe(obj.firstName);
    expect(pass.lastName).toBe(obj.lastName);
    expect(pass.type).toBe(obj.type);
    expect(pass.numberOfGuests).toBe(obj.numberOfGuests);
    expect(pass.registrationNumber).toBe(obj.registrationNumber);
    expect(pass.facilityName).toBe(obj.facilityName);
    expect(pass.date).toBe(obj.date);
    expect(pass.passStatus).toBe(obj.passStatus);
    expect(pass.phoneNumber).toBe(obj.phoneNumber);
    expect(pass.facilityType).toBe(obj.facilityType);
    expect(pass.license).toBe(obj.license);
  });

  it('should set all properties to null if no object is provided', () => {
    const pass = new Pass();
    expect(pass.pk).toBeNull();
    expect(pass.sk).toBeNull();
    expect(pass.email).toBeNull();
    expect(pass.firstName).toBeNull();
    expect(pass.lastName).toBeNull();
    expect(pass.type).toBeNull();
    expect(pass.numberOfGuests).toBeNull();
    expect(pass.registrationNumber).toBeNull();
    expect(pass.facilityName).toBeNull();
    expect(pass.date).toBeNull();
    expect(pass.passStatus).toBeNull();
    expect(pass.phoneNumber).toBeNull();
    expect(pass.facilityType).toBeNull();
    expect(pass.license).toBeNull();
  });
});

describe('PostPass Model', () => {
  it('should create an instance with all properties set from object', () => {
    const obj = {
      email: 'test@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      type: 'PM',
      numberOfGuests: 3,
      date: new Date('2024-02-02'),
      phoneNumber: '0987654321',
      facilityType: 'Trail',
      license: 'LIC456',
      facilityName: 'Facility 2',
      parkName: 'Park 1'
    };
    const postPass = new PostPass(obj);
    expect(postPass.email).toBe(obj.email);
    expect(postPass.firstName).toBe(obj.firstName);
    expect(postPass.lastName).toBe(obj.lastName);
    expect(postPass.type).toBe(obj.type);
    expect(postPass.numberOfGuests).toBe(obj.numberOfGuests);
    expect(postPass.date).toBe(obj.date);
    expect(postPass.phoneNumber).toBe(obj.phoneNumber);
    expect(postPass.facilityType).toBe(obj.facilityType);
    expect(postPass.license).toBe(obj.license);
    expect(postPass.facilityName).toBe(obj.facilityName);
    expect(postPass.parkName).toBe(obj.parkName);
  });

  it('should set all properties to null if no object is provided', () => {
    const postPass = new PostPass();
    expect(postPass.email).toBeNull();
    expect(postPass.firstName).toBeNull();
    expect(postPass.lastName).toBeNull();
    expect(postPass.type).toBeNull();
    expect(postPass.numberOfGuests).toBeNull();
    expect(postPass.date).toBeNull();
    expect(postPass.phoneNumber).toBeNull();
    expect(postPass.facilityType).toBeNull();
    expect(postPass.license).toBeNull();
    expect(postPass.facilityName).toBeNull();
    expect(postPass.parkName).toBeNull();
  });
});